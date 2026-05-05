/**
 * Settlement calculation logic
 * totalSpend = sum of all expenses
 * equalShare = totalSpend / 3
 * For each partner: balance = amountPaid - equalShare
 * Partners with positive balance are owed money.
 * Partners with negative balance owe money.
 */

export function calculateSettlements(partners, expenses) {
  const totalSpend = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0)
  const equalShare = totalSpend / 3

  const partnerBalances = partners.map(partner => {
    const paidByThisPartner = expenses
      .filter(exp => exp.partner_id === partner.id)
      .reduce((sum, exp) => sum + Number(exp.amount), 0)
    
    return {
      id: partner.id,
      name: partner.name,
      amountPaid: paidByThisPartner,
      balance: paidByThisPartner - equalShare
    }
  })

  const oweMoney = partnerBalances
    .filter(p => p.balance < -0.01) // Using -0.01 to avoid floating point issues
    .sort((a, b) => a.balance - b.balance)
  
  const owedMoney = partnerBalances
    .filter(p => p.balance > 0.01)
    .sort((a, b) => b.balance - a.balance)

  const settlements = []

  let i = 0 // owe
  let j = 0 // owed

  // Working copies of balances
  const oweList = oweMoney.map(p => ({ ...p, remainingBalance: Math.abs(p.balance) }))
  const owedList = owedMoney.map(p => ({ ...p, remainingBalance: p.balance }))

  while (i < oweList.length && j < owedList.length) {
    const debtor = oweList[i]
    const creditor = owedList[j]

    const amountToTransfer = Math.min(debtor.remainingBalance, creditor.remainingBalance)

    if (amountToTransfer > 0.01) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(amountToTransfer)
      })
    }

    debtor.remainingBalance -= amountToTransfer
    creditor.remainingBalance -= amountToTransfer

    if (debtor.remainingBalance < 0.01) i++
    if (creditor.remainingBalance < 0.01) j++
  }

  return {
    totalSpend: Math.round(totalSpend),
    equalShare: Math.round(equalShare),
    partnerBalances: partnerBalances.map(p => ({
      ...p,
      amountPaid: Math.round(p.amountPaid),
      balance: Math.round(p.balance),
      percentage: totalSpend > 0 ? (p.amountPaid / totalSpend) * 100 : 0
    })),
    settlements
  }
}
