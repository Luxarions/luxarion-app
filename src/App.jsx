import { useState } from 'react';
import { Client, Account, Databases, ID } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67bd1351003117d9c0ba');

const account = new Account(client);
const databases = new Databases(client);

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);

  const handleRegister = async () => {
    try {
      await account.create(ID.unique(), email, password);
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      alert("Registrasi & Login Berhasil!");
    } catch (error) {
      alert("Gagal Register: " + error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      alert("Login Berhasil!");
    } catch (error) {
      alert("Gagal Login: " + error.message);
    }
  };

  const handleAddPost = async () => {
    try {
      await databases.createDocument(
        'luxarion_db',
        'posts',
        ID.unique(),
        { title, content }
      );
      alert("Data berhasil disimpan!");
      setTitle('');
      setContent('');
    } catch (error) {
      alert("Gagal simpan data: " + error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Luxarion App</h1>
      {!user ? (
        <div>
          <h3>Login / Register</h3>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br/><br/>
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /><br/><br/>
          <button onClick={handleRegister} style={{ marginRight: '10px' }}>Register</button>
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h3>Halo, {user.email}</h3>
          <button onClick={() => { account.deleteSession('current'); setUser(null); }}>Logout</button>
          <hr/>
          <h4>Tambah Data</h4>
          <input placeholder="Judul" value={title} onChange={e => setTitle(e.target.value)} /><br/><br/>
          <textarea placeholder="Isi Konten" value={content} onChange={e => setContent(e.target.value)} /><br/><br/>
          <button onClick={handleAddPost}>Simpan Data</button>
        </div>
      )}
    </div>
  );
}

export default App;
