import type { NixBusCipher } from 'src/domain/NixBusCipher'
import { CipherNotFound } from 'src/domain/errors'
import { NixBusCipherV1 } from 'src/infrastructure/NixBusCipherV1'

export class NixBusCiphers {
  private readonly defaultCipher: NixBusCipher
  private readonly ciphers: Record<string, NixBusCipher>

  constructor() {
    const cipherV1 = new NixBusCipherV1()
    this.defaultCipher = cipherV1
    this.ciphers = {
      [cipherV1.getVersion()]: cipherV1,
    }
  }

  public getByVersion(version: string): NixBusCipher {
    const cipher = this.ciphers[version]
    if (!cipher) {
      throw new CipherNotFound()
    }
    return cipher
  }

  public getDefault(): NixBusCipher {
    return this.defaultCipher
  }
}
