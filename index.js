#! /usr/bin/env node
import inquirer from "inquirer";
class Customer {
    name;
    constructor(name) {
        this.name = name;
    }
}
class BankAccount {
    accNumber;
    balance;
    constructor(accNumber, balance) {
        this.accNumber = accNumber;
        this.balance = balance;
    }
}
class Bank {
    customers = [];
    accounts = [];
    addCustomer(customer) {
        this.customers.push(customer);
    }
    addAccount(account) {
        this.accounts.push(account);
    }
    getAccount(accNumber) {
        return this.accounts.find(account => account.accNumber === accNumber);
    }
    viewBalance(accNumber) {
        const account = this.getAccount(accNumber);
        return account ? `Balance for account ${accNumber}: ${account.balance}` : 'Account not found';
    }
    cashWithdraw(accNumber, amount) {
        const account = this.getAccount(accNumber);
        if (!account)
            return 'Account not found';
        if (account.balance < amount)
            return 'Insufficient funds';
        account.balance -= amount;
        return `Withdrawn ${amount} from account ${accNumber}. New balance: ${account.balance}`;
    }
    cashDeposit(accNumber, amount) {
        const account = this.getAccount(accNumber);
        if (!account)
            return 'Account not found';
        account.balance += amount;
        return `Deposited ${amount} to account ${accNumber}. New balance: ${account.balance}`;
    }
}
async function bankService(bank) {
    while (true) {
        const { select } = await inquirer.prompt({
            type: 'list',
            name: 'select',
            message: 'Choose a service:',
            choices: ['View Balance', 'Cash Withdraw', 'Cash Deposit', 'Exit']
        });
        if (select === 'Exit')
            break;
        const { accNumber } = await inquirer.prompt({
            type: 'input',
            name: 'accNumber',
            message: 'Enter account number:',
            validate: input => !isNaN(Number(input)) || 'Please enter a valid number'
        });
        switch (select) {
            case 'View Balance':
                console.log(bank.viewBalance(Number(accNumber)));
                break;
            case 'Cash Withdraw':
                const { withdrawAmount } = await inquirer.prompt({
                    type: 'input',
                    name: 'withdrawAmount',
                    message: 'Enter amount to withdraw:',
                    validate: input => !isNaN(Number(input)) || 'Please enter a valid number'
                });
                console.log(bank.cashWithdraw(Number(accNumber), Number(withdrawAmount)));
                break;
            case 'Cash Deposit':
                const { depositAmount } = await inquirer.prompt({
                    type: 'input',
                    name: 'depositAmount',
                    message: 'Enter amount to deposit:',
                    validate: input => !isNaN(Number(input)) || 'Please enter a valid number'
                });
                console.log(bank.cashDeposit(Number(accNumber), Number(depositAmount)));
                break;
        }
    }
}
// Example usage
const bank = new Bank();
bank.addCustomer(new Customer('John Doe'));
bank.addAccount(new BankAccount(123456, 1000));
bankService(bank);
