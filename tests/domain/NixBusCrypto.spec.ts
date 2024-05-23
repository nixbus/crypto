import { createNixBusCrypto } from 'lib/crypto'
import { expect, test } from 'playwright/test'

import type { NixBusCrypto } from 'src/domain/NixBusCrypto'
import { PassphraseNotFound } from 'src/domain/errors'

test.describe('NixBusCrypto', () => {
  let nixBusCrypto: NixBusCrypto

  test.beforeEach(async () => {
    const defaultPassphraseVersion = 'v1'
    nixBusCrypto = await createNixBusCrypto({
      defaultPassphraseVersion,
      passphrases: [{ version: defaultPassphraseVersion, phrase: 'a_passphrase' }],
    })
  })

  test('encrypt', async () => {
    const encrypted = await nixBusCrypto.encrypt(JSON.stringify(complexObject()))

    const [passphraseVersion, cipherVersion] = encrypted.split(':')
    expect({ passphraseVersion, cipherVersion }).verify()
  })

  test('decrypt', async () => {
    const original = JSON.stringify(complexObject())
    const encrypted = await nixBusCrypto.encrypt(original)

    const decrypted = await nixBusCrypto.decrypt(encrypted)

    expect(decrypted).toEqual(original)
  })

  test('decrypt PassphraseNotFound', async () => {
    const original = JSON.stringify(complexObject())

    const cryptoV2 = await createNixBusCrypto({
      defaultPassphraseVersion: 'v2',
      passphrases: [{ version: 'v2', phrase: 'a_passphrase' }],
    })
    const encrypted = await cryptoV2.encrypt(original)

    try {
      const cryptoV3 = await createNixBusCrypto({
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

    const cryptoV2 = await createNixBusCrypto({
      defaultPassphraseVersion: 'v2',
      passphrases: [{ version: 'v2', phrase: 'a_passphrase' }],
    })
    const encrypted = await cryptoV2.encrypt(original)

    const cryptoV3 = await createNixBusCrypto({
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
