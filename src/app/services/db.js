import Dexie from 'dexie';
const db = new Dexie('recruitment');

db.version(1).stores({
    studyareas: 'ID,Description,Title,Content,IPadHidden,ParentID,Tags,Terms,RelatedPages',
    programmes: 'ID,Title,DescLocation,DescDuration,DescLevel,DescStart,Content,ParentID,Type',
    contacts: '++id, title, firstname, lastname, date, highschool, notes, phone, email, selected1, selected2, selected3'
});

export default db;