const axios = require('axios')
const chalk = require('chalk')

const keyURLBase64 = 'isi link github lu'
const decodedURL = Buffer.from(keyURLBase64, 'base64').toString('utf-8')

async function getInput(prompt) {
  process.stdout.write(prompt)
  return new Promise((resolve, reject) => {
    process.stdin.once('data', (data) => {
      const input = data.toString().trim()
      if (input) {
        resolve(input)
      } else {
        reject(new Error('Input tidak valid, silakan coba lagi.'))
      }
    })
  })
}

let passwordVerified = false
async function verifyPassword() {
  if (passwordVerified) return
  let systemKey = false
  let inputPassword = ''
  console.log(chalk.yellow.bold('Masukkan Password!'))
  while (!systemKey) {
    inputPassword = await getInput(chalk.yellow.bold('Password: '))
    const keyData = await axios.get(decodedURL, {
      headers: {
        'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Gecko) Chrome/95.0.4638.69 Safari/537.36"
      }
    }).then(res => res.data).catch(() => null)
    if (keyData && keyData.key === inputPassword) {
      console.log(chalk.green.bold('Akses Diterima'))
      systemKey = true
      passwordVerified = true
    } else {
      console.log(chalk.red.bold('Akses Ditolak!'))
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
}

const numbersURL = 'isi link github lu';

let verifiedPhoneNumber = null

async function verifyPhoneNumber() {
  console.log(chalk.yellow.bold('\nMasukkan Nomor WhatsApp'))
  let phoneNumber = await getInput(chalk.yellow.bold('Nomor: '));
  const numbersData = await axios.get(numbersURL, {
    headers: { 'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Gecko) Chrome/95.0.4638.69 Safari/537.36" }
  }).then(res => res.data).catch(() => null);
  
  if (numbersData && numbersData.includes(phoneNumber.trim())) {
    console.log(chalk.green.bold('Nomor diizinkan!'));
    verifiedPhoneNumber = phoneNumber.trim(); // Simpan nomor yang lolos verifikasi
    return true;
  } else {
    console.log(chalk.red.bold('Nomor tidak diizinkan!'));
    return false;
  }
}

async function connectPhoneNumber(Sky) {
  if (!Sky || typeof Sky.requestPairingCode !== 'function') {
    console.log(chalk.red.bold('Error: Sky tidak memiliki fungsi requestPairingCode!'));
    return;
  }
  
  if (!verifiedPhoneNumber) {
    console.log(chalk.red.bold('Error: Tidak ada nomor yang diverifikasi! Jalankan verifyPhoneNumber() dulu.'));
    return;
  }

  try {
    console.log(chalk.yellow.bold(`\nMenghubungkan ke WhatsApp dengan nomor: ${verifiedPhoneNumber}`));
    const code = await Sky.requestPairingCode(verifiedPhoneNumber);
    console.log(chalk.green.bold(`\nKode pairing: `) + chalk.reset(code));
  } catch (error) {
    console.log(chalk.red.bold('Gagal menghubungkan ke WhatsApp!'), error);
  }
}

module.exports = { verifyPassword, verifyPhoneNumber, connectPhoneNumber }
