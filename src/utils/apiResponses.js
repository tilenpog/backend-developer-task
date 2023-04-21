const NO_CONTENT = (res) => res.status(204).json({ message: "No content!" });
const SUCCESS = (res, data) => res.status(200).json(data);
const CREATED = (res, data) => res.status(201).json(data);
const BAD_REQUEST = (res, msg = "Bad request!") =>
  res.status(400).json({ message: msg });
const UNAUTHORIZED = (res) =>
  res.status(401).json({ message: "Unauthorized!" });
const FORBIDDEN = (res) => res.status(403).json({ message: "Forbidden!" });
const NOT_FOUND = (res) => res.status(404).json({ message: "Not found!" });
const INTERNAL_SERVER_ERROR = (res) =>
  res.status(500).json({ message: "Internal server error!" });

module.exports = {
  NO_CONTENT,
  SUCCESS,
  CREATED,
  NOT_FOUND,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
};
