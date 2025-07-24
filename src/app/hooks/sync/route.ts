import { database } from '@/lib/firebase';
import { ref, push } from 'firebase/database';

export async function GET() {
  try {
    console.log('Fetching data from GSheet...');
    // [TODO] Fetch data from Google Sheets API replace data with actual fetched data
    // For now, we will simulate the data
    const data = {
      field1: 'value1',
      field2: 'value2',
      createdAt: new Date().toISOString(),
    };

    console.log('Push data to firebase:');
    const dataRef = ref(database, 'table_name_1');
    await push(dataRef, data);
    return new Response('Pushed data to Firebase successfully', {
      status: 200,
    });
  } catch (error) {
    console.error('Error pushing data to Firebase:', error);
    return new Response('Error pushing data to Firebase', {
      status: 500,
    });
  }
}
