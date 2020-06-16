# Articles

Articles is an application for collecting bibliographic data of organization employees in an international citation database **Scopus** and **Web of Science**. The application recognizes the author’s affiliation with the department and the institute. The list of articles of the organization is maintained in a primitive form in Excel. To exclude manual data entry, the application processes an array of articles and exports data in an already existing table format for Excel.

# Installation
  - Clone the repository by using `git clone`.
  - Run `npm install` in the cloned directory.
  - Adding variables to your environment:
      - `DB_NAME=your_db_mame`
      - `DB_USER=your_postgres_user`
      - `DB_PASSWORD=your_password`
      - `DB_HOST=your_host`
      - `PORT=your_port_number`

# How to Run
```
pm2 start app.js
```
or
```
node app.js
```

## Endpoints
- **/count** : 
    - Method: **GET**
      - Description: Returns a table with statistics on articles by year.
- **/eids** :
    - Method: **PUT**
      -  Description: Writes the identifiers of articles that are already in local storage.
- **/scopus/export** :
    - Method: **GET**
      -  Description: Returns a processed array of articles **Scopus** database.
- **/scopus/paper/:id** :
    - Method: **GET**
      -  Description: Returns article data by id.
- **/scopus/connection/:id** :
    - Method: **GET**
      -  Description: Returns the links of the authors of the article by id (place of work, if the author is identified).
- **/scopus/correction** :
    - Method: **PUT**
      -  Description: Updating article data in the database.
      -  Body: Modified article data.
- **/scopus/parser** :
    - Method: **POST**
      -  Description: Handles an array of articles.
      -  Body: Array of articles.
- **/scopus/delete/:id** :
    - Method: **DELETE**
      -  Deletes an article from the database by id.
- **/wos/export** :
    - Method: **GET**
      -  Description: Returns a processed array of articles **Web of Science** database.
- **/wos/paper/:id** :
    - Method: **GET**
      -  Description: Returns article data by id.
- **/wos/connection/:id** :
    - Method: **GET**
      -  Description: Returns the links of the authors of the article by id (place of work, if the author is identified).
- **/wos/correction** :
    - Method: **PUT**
      -  Description: Updating article data in the database.
      -  Body: Modified article data.
- **/wos/parser** :
    - Method: **POST**
      -  Description: Handles an array of articles.
      -  Body: Array of articles.
- **/wos/delete/:id** :
    - Method: **DELETE**
      -  Deletes an article from the database by id.

## Client
The client code can be viewed at the link: https://github.com/zeeebr/articles_frontend

License
----

MIT