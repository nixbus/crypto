import type { NixBusCipher } from 'src/domain/NixBusCipher'
import type { Passphrase, PassphraseVersion } from 'src/domain/NixBusPassphrases'
import { CipherEncryptedDataNotValid } from 'src/domain/errors'

type CipherData = {
  passphraseVersion: PassphraseVersion
  version: string
  data: Uint8Array
  iv: Uint8Array
  salt: Uint8Array
}

export class NixBusCipherV1 implements NixBusCipher {
  private readonly version: string
  private keyCache: Map<string, Uint8Array>

  constructor() {
    this.version = 'nb-c1'
    this.keyCache = new Map()
  }

  public async decrypt(text: string, passphrase: Passphrase): Promise<string> {
    const ed = this.deserialize(text)
    const phrase = passphrase.phrase
    const salt = ed.salt
    const iv = ed.iv
    const data = ed.data

    const { key } = await this.deriveKey(phrase, salt)
    const decryptedContent = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)

    return new TextDecoder().decode(decryptedContent)
  }

  public async encrypt(text: string, passphrase: Passphrase): Promise<string> {
    const phrase = passphrase.phrase
    const passphraseVersion = passphrase.version

    const { key, salt } = await this.deriveKey(phrase)
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encryptedContent = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      new TextEncoder().encode(text),
    )

    return this.serialize({
      passphraseVersion,
      version: this.version,
      data: new Uint8Array(encryptedContent),
      iv,
      salt,
    })
  }

  public getVersion(): string {
    return this.version
  }

  private deserialize(text: string): CipherData {
    const parts = text.split(':')
    if (parts.length !== 5) throw new CipherEncryptedDataNotValid()
    return {
      passphraseVersion: parts[0],
      version: parts[1],
      salt: Uint8Array.from(atob(parts[2]), (c) => c.charCodeAt(0)),
      iv: Uint8Array.from(atob(parts[3]), (c) => c.charCodeAt(0)),
      data: Uint8Array.from(atob(parts[4]), (c) => c.charCodeAt(0)),
    }
  }

  private serialize(ed: CipherData) {
    const passphraseVersion = ed.passphraseVersion
    const version = ed.version
    const salt = btoa(String.fromCharCode(...ed.salt))
    const iv = btoa(String.fromCharCode(...ed.iv))
    const data = btoa(String.fromCharCode(...ed.data))

    return `${passphraseVersion}:${version}:${salt}:${iv}:${data}`
  }

  private async deriveKey(passphrase: string, salt = crypto.getRandomValues(new Uint8Array(16))) {
    const s = btoa(String.fromCharCode(...salt))
    const cacheKey = `${passphrase}:${s}`

    if (this.keyCache.has(cacheKey)) {
      const cachedKey = this.keyCache.get(cacheKey)
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        cachedKey!,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt'],
      )
      return { key: keyMaterial, salt }
    }

    const encoder = new TextEncoder()
    const passphraseBuffer = encoder.encode(passphrase)

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passphraseBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveKey'],
    )

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 1000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt'],
    )

    const exportedKey = await crypto.subtle.exportKey('raw', key)
    this.keyCache.set(cacheKey, new Uint8Array(exportedKey))

    return { key, salt }
  }
}
