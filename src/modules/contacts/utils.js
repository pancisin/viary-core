/**
 * 
 * @param {Object} nameObj 
 */
const formatDisplayName = nameObj => {
  return `${nameObj.prefix || ''} ${nameObj.firstName} ${nameObj.lastName} ${nameObj.suffix || ''}`
}

export {
  formatDisplayName
}