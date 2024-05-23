class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = message
  }
}

export class CipherNotFound extends DomainError {
  constructor() {
    super('CipherNotFound')
  }
}

export class CipherEncryptedDataNotValid extends DomainError {
  constructor() {
    super('CipherEncryptedDataNotValid')
  }
}

export class PassphraseNotFound extends DomainError {
  constructor() {
    super('PassphraseNotFound')
  }
}
