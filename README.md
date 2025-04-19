# crypto-ts

A robust TypeScript library for secure data encryption and decryption with support for versioned passphrases and ciphers. Built to provide a reliable way to protect sensitive data in JavaScript/TypeScript applications.

## Features

* **Versioned Passphrases**: Manage multiple passphrases with version tracking
* **Cipher Versioning**: Support for different encryption algorithms with version control
* **In-Memory Passphrase Storage**: Secure storage of passphrases in memory
* **AES-GCM Encryption**: Industry-standard encryption with authenticated encryption
* **PBKDF2 Key Derivation**: Secure key derivation from passphrases
* **Key Caching**: Performance optimization for repeated encryption/decryption
* **Singleton Pattern**: Easy access to crypto instance throughout your application
* **Thread-safe**: Designed for concurrent access

## Installation

```bash
npm install @nixbus/crypto
```

Requires Node.js v20.9.0 or higher.

## Usage

### Basic Usage

```typescript
import { createNixBusCrypto } from '@nixbus/crypto'

// Define passphrases with versions
const passphrases = [
  { version: 'v1', phrase: 'your_secret_passphrase' }
]

// Create a new crypto instance with default passphrase version
const crypto = createNixBusCrypto({
  defaultPassphraseVersion: 'v1',
  passphrases
})

// Encrypt data
const plaintext = 'Sensitive data here'
const encrypted = await crypto.encrypt(plaintext)
console.log(`Encrypted: ${encrypted}`)

// Decrypt data
const decrypted = await crypto.decrypt(encrypted)
console.log(`Decrypted: ${decrypted}`)
```

### Using Multiple Passphrases

```typescript
// Define multiple passphrases with different versions
const passphrases = [
  { version: 'v1', phrase: 'old_passphrase' },
  { version: 'v2', phrase: 'new_passphrase' }
]

// Create crypto with v2 as default, but able to decrypt v1
const crypto = createNixBusCrypto({
  defaultPassphraseVersion: 'v2',
  passphrases
})

// Will encrypt with v2
const newEncrypted = await crypto.encrypt('data')

// Can decrypt both v1 and v2 encrypted data
const oldEncrypted = 'v1:nb-c1:...' // v1 encrypted data
await crypto.decrypt(oldEncrypted) // Works
await crypto.decrypt(newEncrypted) // Also works
```

### Singleton Pattern

```typescript
import { getNixBusCrypto } from '@nixbus/crypto'

// Get or create singleton instance
const c1 = getNixBusCrypto({
  defaultPassphraseVersion: 'v1',
  passphrases
})
const c2 = getNixBusCrypto({
  defaultPassphraseVersion: 'v1',
  passphrases
})

// c1 and c2 reference the same instance
```

## Key Concepts

### Passphrase Versioning

Passphrases are versioned to allow for passphrase rotation while maintaining backward compatibility. The library can decrypt data encrypted with any known passphrase version, while encrypting new data with the default version.

### Cipher Structure

The encrypted data format follows this structure:

```
passphraseVersion:cipherVersion:salt:iv:encryptedData
```

For example:

```
v1:nb-c1:cXFla2drLfPem5XbOwHX9A==:iFNB4WWHfc6D/55Z:sNS1/yhyYuiTYNMpZDRbLA...
```

### Architecture

The library follows a clean architecture approach:

* **Domain Layer**: Core interfaces and entities (`NixBusCrypto`, `NixBusCipher`, etc.)
* **Infrastructure Layer**: Implementations of domain interfaces (`NixBusCipherV1`, `NixBusInMemoryPassphrases`)
* **API Layer**: Public interfaces for library consumers (`crypto` module)

### Security Considerations

* Passphrases should be kept secure and not hardcoded in your application
* For production use, consider using a secure secret management solution
* The library uses AES-GCM with PBKDF2 key derivation for strong security
* Requires an environment with Web Crypto API support (Node.js 20.9.0+ or modern browsers)
