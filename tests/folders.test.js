const request = require('supertest');
const app = require('../src/app');
const { User, Folder} = require('../src/models/model');
const { seedDb } = require('../scripts/seedDb');

describe('GET /folders', () => {
    beforeAll(async () => {
        await seedDb();
    });

    it('should return all folders', async () => {
        const res = await request(app)
        .get('/folders')
        .set('Authorization', 'Basic YWRtaW46YWRtaW4='); // 'admin:admin' base64-encoded

        expect(res.status).toEqual(200);
        expect(res.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({name: 'Folder 1', UserId: 1 }),
              expect.objectContaining({name: 'Folder 2', UserId: 1 }),
            ])
          );
    });

    it('should require auth', async () => {
        const res = await request(app)
        .get('/folders')

        expect(res.status).toEqual(401);
    });

    it('should return folder by id', async () => {
        const res = await request(app)
        .get('/folders/1')
        .set('Authorization', 'Basic YWRtaW46YWRtaW4='); // 'admin:admin' base64-encoded

        expect(res.status).toEqual(200);
        expect(res.body).toEqual(expect.objectContaining({name: 'Folder 1', UserId: 1 }));
    });

    it ('should return 404 if folder not found', async () => {
        const res = await request(app)
        .get('/folders/4')
        .set('Authorization', 'Basic YWRtaW46YWRtaW4='); // 'admin:admin' base64-encoded

        expect(res.status).toEqual(404);
    });
});

describe('CREATE /folders', () => {
    beforeEach(async () => {
        await seedDb();
    });

    it('should require auth', async () => {
        const res = await request(app)
        .post('/folders')
        .send({ name: 'New Folder', UserId: 1 });

        expect(res.status).toEqual(401);
    });

    it('should create a new folder', async () => {
        const res = await request(app)
        .post('/folders')
        .set('Authorization', 'Basic YWRtaW46YWRtaW4=') // 'admin:admin' base64-encoded
        .send({ name: 'New Folder'});

        expect(res.status).toEqual(201);
        expect(res.body).toEqual(expect.objectContaining({name: 'New Folder', UserId: 1 }));
    });

    //TODO
    it('should return 400 if name is missing', async () => {
        const res = await request(app)
        .post('/folders')
        .set('Authorization', 'Basic YWRtaW46YWRtaW4=') // 'admin:admin' base64-encoded
        .send({ title: 'New Folder'});

        expect(res.status).toEqual(400);
    });
});

describe('UPDATE /folders', () => {
    beforeEach(async () => {
        await seedDb();
    });

    it('should require auth', async () => {
        const res = await request(app)
        .post('/folders')
        .send({ name: 'New Folder', UserId: 1 });

        expect(res.status).toEqual(401);
    });

    it('should return 400 if folder not found', async () => {
        const res = await request(app)
        .put('/folders/4')
        .set('Authorization', 'Basic YWRtaW46YWRtaW4=') // 'admin:admin' base64-encoded
        .send({ name: 'updated folder'});

        expect(res.status).toEqual(400);
    });

    it('should update folder', async () => {
        let res = await request(app)
        .put('/folders/1')
        .set('Authorization', 'Basic YWRtaW46YWRtaW4=') // 'admin:admin' base64-encoded
        .send({ name: 'updated folder'});

        expect(res.status).toEqual(204);

        res = await request(app)
        .get('/folders/1')
        .set('Authorization', 'Basic YWRtaW46YWRtaW4=') // 'admin:admin' base64-encoded

        expect(res.body).toEqual(expect.objectContaining({name: 'updated folder', UserId: 1 }));
    });
});

describe('DELETE /folders', () => {
    beforeEach(async () => {
        await seedDb();
    });

    it('should require auth', async () => {
        let res = await request(app)
        .delete('/folders');

        expect(res.status).toEqual(401);

         res = await request(app)
        .delete('/folders/1');

        expect(res.status).toEqual(401);
    });

    it('should not delete other users folders', async () => {
        let res = await request(app)
        .delete('/folders/4')
        .set('Authorization', 'Basic YWRtaW46YWRtaW4='); // 'admin:admin' base64-encoded

        expect(res.status).toEqual(204);

        res = await request(app)
        .get('/folders/4')
        .set('Authorization', 'Basic dXNlcjp1c2Vy='); // 'user:user' base64-encoded

        expect(res.status).toEqual(200);
    });

    it('should delete folder', async () => {
        let res = await request(app)
        .delete('/folders/1')
        .set('Authorization', 'Basic YWRtaW46YWRtaW4='); // 'admin:admin' base64-encoded

        expect(res.status).toEqual(204);

        res = await request(app)
        .get('/folders/1')
        .set('Authorization', 'Basic YWRtaW46YWRtaW4=') // 'admin:admin' base64-encoded

        expect(res.status).toEqual(404);
    });

    it ('should delete all folders', async () => {
        let res = await request(app)
        .delete('/folders')
        .set('Authorization', 'Basic YWRtaW46YWRtaW4='); // 'admin:admin' base64-encoded

        expect(res.status).toEqual(204);

        res = await request(app)
        .get('/folders')
        .set('Authorization', 'Basic YWRtaW46YWRtaW4='); // 'admin:admin' base64-encoded

        expect(res.body.length).toEqual(0);
    });
});