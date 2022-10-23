CREATE TABLE blogs (id SERIAL PRIMARY KEY,author text,url text NOT NULL,title text NOT NULL,likes integer DEFAULT 0);

insert into blogs(author, url, title, likes) values ('Artem', 'localhost', 'My blog', 1);
insert into blogs(author, url, title, likes) values ('Ulya', 'localhost', 'Her blog', 5);