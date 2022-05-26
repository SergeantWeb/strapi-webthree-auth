const { ethers } = require("ethers")
const crypto = require('crypto')

module.exports = {
  /**
   * Generate random token
   * @returns {`${string}-${string}-${string}-${string}`}
   */
  generateToken: () => {
    const b1 = crypto.randomBytes(4).toString('hex')
    const b2 = crypto.randomBytes(4).toString('hex')
    const b3 = crypto.randomBytes(4).toString('hex')
    const b4 = crypto.randomBytes(4).toString('hex')
    return `${b1}-${b2}-${b3}-${b4}`
  },

  /**
   * Sanitize address
   * @param a : address
   * @returns {string} : sanitized address
   */
  sanitizeAddress: a => {
    let address = null
    try {
      address = ethers.utils.getAddress(a)
    } catch (e) {
      address = null
    }
    return address
  },

  /**
   * Create new user account in database
   * @param data
   * @returns {Promise<any>}
   */
  createUser: async data => {
    // Get default role to assign to the new user
    const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' })
    const settings = await pluginStore.get({ key: 'advanced' })
    if (!settings.allow_register) {
      ctx.send({
        success: false,
        error: 'Register action is currently disabled'
      })
      return
    }
    const role = await strapi.query('plugin::users-permissions.role').findOne({where: {type: settings.default_role}})

    return await strapi.query('plugin::users-permissions.user').create({
      data: {...data, ...{
        role: role.id
      }}
    })
  },

  /**
   * Confirm a user in database for the given address
   * @param address
   * @returns {Promise<void>}
   */
  confirmUserByAddress: async address => {
    await strapi.query('plugin::users-permissions.user').update({
      where: {address},
      data: {
        confirmed: true
      }
    })
  },

  /**
   * Update user token for a given address
   * @param address
   * @param token
   * @returns {Promise<any>}
   */
  updateUserToken: async (address, token) => {
    return await strapi.query('plugin::users-permissions.user').update({
      where: {address},
      data: {token}
    })
  },

  /**
   * Verify signed message for the given address
   * @param address
   * @param signature
   * @returns {Promise<boolean>}
   */
  verifySignature: async (address, signature) => {
    const user = await strapi.query('plugin::users-permissions.user').findOne({where: {address}})
    if (!user) return false

    const message = 'Your authentication token : ' + user.token
    let safeAccount = null
    let safeAddress = null
    try {
      const account = ethers.utils.verifyMessage(message, signature)
      safeAccount = ethers.utils.getAddress(account)
      safeAddress = ethers.utils.getAddress(address)
    } catch (e) {
      return false
    }

    return safeAccount === safeAddress
  }

}
