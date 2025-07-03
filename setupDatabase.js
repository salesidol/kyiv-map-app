const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './map_data.db',
  },
  useNullAsDefault: true,
});

async function setup() {
  try {
    console.log('Начинаем настройку базы данных...');

    const hasTable = await knex.schema.hasTable('apartments');
    if (hasTable) {
      console.log('Таблица "apartments" уже существует. Удаляем старую.');
      await knex.schema.dropTable('apartments');
    }

    console.log('Создаем таблицу "apartments"...');
    await knex.schema.createTable('apartments', (table) => {
      table.increments('id').primary();
      table.integer('buildingId').notNullable();
      table.string('address');
      table.string('price');
      table.integer('rooms');
      table.string('area');
      table.string('floor');
      table.text('description');
      table.json('photos');
      table.string('contact_link');
    });
    console.log('Таблица создана.');

    console.log('Добавляем тестовые квартиры с именами файлов...');
    const apartmentsToInsert = [
        { id: 1, buildingId: 390907787, address: "ул. Драгоманова, 2А", price: "16,500 грн", rooms: 2, area: "75 м²", floor: "18/25", description: "Светлая квартира с хорошим ремонтом и панорамным видом.", photos: JSON.stringify(["flat1.jpg"]) },
        { id: 2, buildingId: 390907787, address: "ул. Драгоманова, 2А", price: "22,000 грн", rooms: 3, area: "92 м²", floor: "10/25", description: "Просторная трехкомнатная, есть вся техника.", photos: JSON.stringify(["flat2.jpg"]) },
        { id: 3, buildingId: 380147923, address: "ул. Ахматовой, 15", price: "14,000 грн", rooms: 1, area: "45 м²", floor: "5/16", description: "Уютная квартира-студия для одного или пары.", photos: JSON.stringify(["flat3.jpg"]) }
    ];
    
    await knex('apartments').insert(apartmentsToInsert);
    console.log('Квартиры успешно добавлены.');
    
    console.log('Настройка завершена!');
  } catch (error) {
    console.error('Ошибка при настройке базы данных:', error);
  } finally {
    await knex.destroy();
  }
}

setup();