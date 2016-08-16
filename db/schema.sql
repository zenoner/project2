DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_digest VARCHAR(255)
);

CREATE TABLE favorites(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  publisher VARCHAR(255) NOT NULL,
  publisherdate VARCHAR(255) NOT NULL,
  categories VARCHAR(255) NOT NULL,
  page_num  VARCHAR(255) NOT NULL,
  isbm VARCHAR(255) NOT NULL,
  buy_book VARCHAR(255) NOT NULL,
  sample_book VARCHAR(255) NOT NULL,
  fav_id INTEGER REFERENCES users(id)
);

-- INSERT INTO favorites (title, author, image, description) VALUES ('zen', 'seiji', 'https://www.nasa.gov','this is test' )
