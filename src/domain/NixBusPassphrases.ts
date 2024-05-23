export type PassphraseVersion = string

export type Passphrase = {
  version: PassphraseVersion
  phrase: string
}

export interface NixBusPassphrases {
  getByVersion(version: PassphraseVersion): Promise<Passphrase>

  getDefault(): Promise<Passphrase>

  put(passphrase: Passphrase): void
}
