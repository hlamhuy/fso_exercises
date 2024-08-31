CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes INTEGER DEFAULT 0
);

insert into blogs (author, url, title) values ('Michael Chan', 'https://reactpatterns.com/', 'React patterns');
insert into blogs (author, url, title) values ('Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefini
tions.html', 'First class tests');
