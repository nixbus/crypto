import { createNixBusCrypto } from 'lib/crypto'
import { expect, test } from 'playwright/test'

import type { NixBusCrypto } from 'src/domain/NixBusCrypto'
import { PassphraseNotFound } from 'src/domain/errors'

test.describe('NixBusCrypto', () => {
  let nixBusCrypto: NixBusCrypto

  test.beforeEach(async () => {
    const defaultPassphraseVersion = 'v1'
    nixBusCrypto = createNixBusCrypto({
      defaultPassphraseVersion,
      passphrases: [{ version: defaultPassphraseVersion, phrase: 'a_passphrase' }],
    })
  })

  test('encrypt', async () => {
    const encrypted = await nixBusCrypto.encrypt(JSON.stringify(complexObject()))

    const [passphraseVersion, cipherVersion] = encrypted.split(':')
    expect({ passphraseVersion, cipherVersion }).verify()
  })

  test('decrypt cipher v1 nb-c1', async () => {
    const original = JSON.stringify(complexObject())
    const encrypted =
      'v1:nb-c1:cXFla2drLfPem5XbOwHX9A==:iFNB4WWHfc6D/55Z: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'

    const decrypted = await nixBusCrypto.decrypt(encrypted)

    expect(decrypted).toEqual(original)
  })

  test('decrypt PassphraseNotFound', async () => {
    const original = JSON.stringify(complexObject())

    const cryptoV2 = createNixBusCrypto({
      defaultPassphraseVersion: 'v2',
      passphrases: [{ version: 'v2', phrase: 'a_passphrase' }],
    })
    const encrypted = await cryptoV2.encrypt(original)

    try {
      const cryptoV3 = createNixBusCrypto({
        defaultPassphraseVersion: 'v3',
        passphrases: [{ version: 'v3', phrase: 'another_passphrase' }],
      })
      await cryptoV3.decrypt(encrypted)
    } catch (error) {
      expect(error).toBeInstanceOf(PassphraseNotFound)
    }
  })

  test('decrypt if provide all passphrase versions', async () => {
    const original = JSON.stringify(complexObject())

    const cryptoV2 = createNixBusCrypto({
      defaultPassphraseVersion: 'v2',
      passphrases: [{ version: 'v2', phrase: 'a_passphrase' }],
    })
    const encrypted = await cryptoV2.encrypt(original)

    const cryptoV3 = createNixBusCrypto({
      defaultPassphraseVersion: 'v3',
      passphrases: [
        { version: 'v2', phrase: 'a_passphrase' },
        { version: 'v3', phrase: 'another_passphrase' },
      ],
    })
    const decrypted = await cryptoV3.decrypt(encrypted)

    expect(decrypted).toEqual(original)
  })
})

function complexObject() {
  return {
    result: [
      {
        status: 'disabled',
        name: {
          first: 'Ardella',
          middle: 'Cameron',
          last: 'Lindgren',
        },
        username: 'Ardella-Lindgren',
        password: 'FlPE5mDTenoh1Nn',
        emails: ['Levi64@example.com', 'Joel7@gmail.com'],
        phoneNumber: '1-739-201-0185',
        location: {
          street: '473 Althea Glen',
          city: 'North Joaquin',
          state: 'Connecticut',
          country: 'Bangladesh',
          zip: '17772-2173',
          coordinates: {
            latitude: 60.6908,
            longitude: -177.1275,
          },
        },
        website: 'https://linear-pita.com/',
        domain: 'threadbare-biology.name',
        job: {
          title: 'Direct Response Planner',
          descriptor: 'Product',
          area: 'Interactions',
          type: 'Facilitator',
          company: "Gibson, O'Hara and McClure",
        },
        creditCard: {
          number: '3529-0090-8912-2623',
          cvv: '772',
          issuer: 'maestro',
        },
        uuid: '3299b629-37f1-4c0a-8d6d-f6cdb3a4f1ae',
        objectId: '664f72f0932e55b4cf9e8305',
      },
      {
        status: 'disabled',
        name: {
          first: 'Erica',
          middle: 'Jordan',
          last: 'Larkin',
        },
        username: 'Erica-Larkin',
        password: 'TIkCakFzOoXqyZd',
        emails: ['Bette_Weimann@example.com', 'Stella_Rice0@example.com'],
        phoneNumber: '357-344-0892 x667',
        location: {
          street: '3184 Rhiannon Vista',
          city: 'Daxview',
          state: 'Nebraska',
          country: 'Azerbaijan',
          zip: '80231-5064',
          coordinates: {
            latitude: -38.2938,
            longitude: -88.1684,
          },
        },
        website: 'https://which-disaster.biz',
        domain: 'wasteful-band.net',
        job: {
          title: 'Investor Response Engineer',
          descriptor: 'District',
          area: 'Operations',
          type: 'Developer',
          company: 'Bins, Luettgen and White',
        },
        creditCard: {
          number: '6771-8996-2594-7378',
          cvv: '802',
          issuer: 'mastercard',
        },
        uuid: '13533d88-9833-4820-818c-f78e15d11fc3',
        objectId: '664f72f0932e55b4cf9e8306',
      },
    ],
  }
}
