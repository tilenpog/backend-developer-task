const request = require("supertest");
const app = require("../src/app");
const { seedDb } = require("../scripts/seedDb");

describe("GET /notes", () => {
  beforeAll(async () => {
    await seedDb();
  });

  it("should return all notes", async () => {
    const res = await request(app)
      .get("/notes")
      .set("Authorization", "Basic YWRtaW46YWRtaW4="); // 'admin:admin' base64-encoded

    expect(res.status).toEqual(200);
    expect(res.body.allNotesCount).toEqual(5);
    expect(res.body.notes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Note 1", visibility: "public" }),
        expect.objectContaining({ name: "Note 2", visibility: "public" }),
        expect.objectContaining({ name: "Note 3", visibility: "private" }),
      ])
    );
  });

  it("should paginate notes", async () => {
    const res = await request(app)
      .get("/notes?page=2&pageSize=2")
      .set("Authorization", "Basic YWRtaW46YWRtaW4="); // 'admin:admin' base64-encoded

    expect(res.status).toEqual(200);
    expect(res.body.allNotesCount).toEqual(5);
    expect(res.body.notes).toHaveLength(2);
    expect(res.body.notes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Note 3", visibility: "private" }),
        expect.objectContaining({ name: "Note 5", visibility: "public" }),
      ])
    );
  });

  it("should return only public notes when unauthorized", async () => {
    const res = await request(app).get("/notes");

    expect(res.status).toEqual(200);
    expect(res.body.allNotesCount).toEqual(4);
    expect(res.body.notes.every((note) => note.visibility === "public"));
  });

  it("should return note by id", async () => {
    const res = await request(app)
      .get("/notes/1")
      .set("Authorization", "Basic YWRtaW46YWRtaW4="); // 'admin:admin' base64-encoded

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({ name: "Note 1", visibility: "public" })
    );
  });

  it("should return 404 if folder not found", async () => {
    const res = await request(app)
      .get("/notes/404")
      .set("Authorization", "Basic YWRtaW46YWRtaW4="); // 'admin:admin' base64-encoded

    expect(res.status).toEqual(404);
  });

  it("should return 404 if note is private and user is not authorized or is not owner", async () => {
    let res = await request(app).get("/notes/3");

    expect(res.status).toEqual(404);

    res = await request(app)
      .get("/notes/4")
      .set("Authorization", "Basic YWRtaW46YWRtaW4="); // 'admin:admin' base64-encoded

    expect(res.status).toEqual(404);
  });
});

describe("CREATE /notes", () => {
  let createNoteObject = {
    name: "Note title",
    type: "list",
    visibility: "public",
    folderId: 2,
    items: [{ body: "body 1" }, { body: "body 2" }],
  };

  beforeEach(async () => {
    await seedDb();
  });

  it("should require auth", async () => {
    const res = await request(app).post("/notes").send(createNoteObject);

    expect(res.status).toEqual(401);
  });

  it("should create a new note", async () => {
    let res = await request(app)
      .post("/notes")
      .set("Authorization", "Basic YWRtaW46YWRtaW4=") // 'admin:admin' base64-encoded
      .send(createNoteObject);

    expect(res.status).toEqual(201);

    const noteId = res.body;
    res = await request(app)
      .get(`/notes/${noteId}`)
      .set("Authorization", "Basic YWRtaW46YWRtaW4="); // 'admin:admin' base64-encoded

    expect(res.body).toEqual(
      expect.objectContaining({ name: createNoteObject.name })
    );
  });

  //TODO data validation
  // it('should return 400 if data is missing', async () => {
  //     const res = await request(app)
  //     .post('/notes')
  //     .set('Authorization', 'Basic YWRtaW46YWRtaW4=') // 'admin:admin' base64-encoded
  //     .send({ name: 'New note'});

  //     expect(res.status).toEqual(400);
  // });
});

describe("UPDATE /folders", () => {
  beforeEach(async () => {
    await seedDb();
  });

  it("should require auth", async () => {
    const res = await request(app).put("/notes/1").send({ name: "New Folder" });

    expect(res.status).toEqual(401);
  });

  it("should return 404 if note not found", async () => {
    const res = await request(app)
      .put("/note/404")
      .set("Authorization", "Basic YWRtaW46YWRtaW4=") // 'admin:admin' base64-encoded
      .send({ name: "updated note" });

    expect(res.status).toEqual(404);
  });

  it("should update note", async () => {
    let res = await request(app)
      .put("/notes/1")
      .set("Authorization", "Basic YWRtaW46YWRtaW4=") // 'admin:admin' base64-encoded
      .send({ name: "updated note" });

    expect(res.status).toEqual(204);

    res = await request(app)
      .get("/notes/1")
      .set("Authorization", "Basic YWRtaW46YWRtaW4="); // 'admin:admin' base64-encoded

    expect(res.body).toEqual(expect.objectContaining({ name: "updated note" }));
  });
});

describe("DELETE /notes", () => {
  beforeEach(async () => {
    await seedDb();
  });

  it("should require auth", async () => {
    let res = await request(app).delete("/notes/");

    expect(res.status).toEqual(401);

    res = await request(app).delete("/notes/1");

    expect(res.status).toEqual(401);
  });

  it("should not delete other users notes", async () => {
    let res = await request(app)
      .delete("/notes/4")
      .set("Authorization", "Basic YWRtaW46YWRtaW4="); // 'admin:admin' base64-encoded

    expect(res.status).toEqual(204);

    res = await request(app)
      .get("/notes/4")
      .set("Authorization", "Basic dXNlcjp1c2Vy="); // 'user:user' base64-encoded

    expect(res.status).toEqual(200);
  });

  it("should delete note", async () => {
    let res = await request(app)
      .delete("/notes/1")
      .set("Authorization", "Basic YWRtaW46YWRtaW4="); // 'admin:admin' base64-encoded

    expect(res.status).toEqual(204);

    res = await request(app)
      .get("/notes/1")
      .set("Authorization", "Basic YWRtaW46YWRtaW4="); // 'admin:admin' base64-encoded

    expect(res.status).toEqual(404);
  });

  it("should delete all notes", async () => {
    let res = await request(app)
      .delete("/notes")
      .set("Authorization", "Basic YWRtaW46YWRtaW4="); // 'admin:admin' base64-encoded

    expect(res.status).toEqual(204);

    res = await request(app)
      .get("/notes")
      .set("Authorization", "Basic YWRtaW46YWRtaW4="); // 'admin:admin' base64-encoded

    expect(res.body.notes.every((note) => note.Folder.UserId !== 1));
    expect(res.body.allNotesCount).toEqual(2);
  });
});
