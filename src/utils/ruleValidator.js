const RuleValidator = {
  minValue: (transaction, value) => BigInt(transaction.value) >= BigInt(value),
  maxValue: (transaction, value) => BigInt(transaction.value) <= BigInt(value),
  fromAddress: (transaction, value) => transaction.from === value,
  toAddress: (transaction, value) => transaction.to === value,
  minGas: (transaction, value) => transaction.gas >= value,
  maxGas: (transaction, value) => transaction.gas <= value
};

function validateTransactionWithRules(transaction, rule) {
  if (!transaction) {
    return false;
  }
  let isValid = true;

  for (const ruleKey in rule) {
    if (Object.hasOwnProperty.call(rule, ruleKey)) {
      if (RuleValidator[ruleKey]) {
        isValid = RuleValidator[ruleKey](transaction, rule[ruleKey]);
        if (!isValid) break;
      } else {
        console.warn(`Unknown validation rule: ${ruleKey}`);
      }
    }
  }

  return isValid;
}

module.exports = {
  validateTransactionWithRules
};
