import { Storage } from 'aws-amplify';

export async function S3Upload(file) {
  const filename = `${Date.now()}-${file.name}`;

  try {
    const stored = await Storage.vault.put(filename, file, {
      contentType: file.type
    });

    return stored.key;
  }
  catch (e) {
    console.error(`Error: [${JSON.stringify(e, null, 4)}]`);
    return false;
  }
}

export async function S3Delete(filename) {
  try {
    await Storage.vault.remove(filename);
    return true;
  }
  catch (e) {
    console.error(`Error: [${JSON.stringify(e, null, 4)}]`);
    alert(e);
    return false;
  }
}