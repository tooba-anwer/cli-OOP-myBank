#! /usr/bin/env node

import inquirer from "inquirer";


class Customer {
    constructor(public name: string) {}
  }
  
  class BankAccount {
    constructor(public accNumber: number, public balance: number) {}
  }
  
  class Bank {
    private customers: Customer[] = [];
    private accounts: BankAccount[] = [];
  
    addCustomer(customer: Customer): void {
      this.customers.push(customer);
    }
  
    addAccount(account: BankAccount): void {
      this.accounts.push(account);
    }
  
    getAccount(accNumber: number): BankAccount | undefined {
      return this.accounts.find(account => account.accNumber === accNumber);
    }
  
    viewBalance(accNumber: number): string {
      const account = this.getAccount(accNumber);
      return account ? `Balance for account ${accNumber}: ${account.balance}` : 'Account not found';
    }
  
    cashWithdraw(accNumber: number, amount: number): string {
      const account = this.getAccount(accNumber);
      if (!account) return 'Account not found';
      if (account.balance < amount) return 'Insufficient funds';
      account.balance -= amount;
      return `Withdrawn ${amount} from account ${accNumber}. New balance: ${account.balance}`;
    }
  
    cashDeposit(accNumber: number, amount: number): string {
      const account = this.getAccount(accNumber);
      if (!account) return 'Account not found';
      account.balance += amount;
      return `Deposited ${amount} to account ${accNumber}. New balance: ${account.balance}`;
    }
  }
  
  async function bankService(bank: Bank) {
    while (true) {
      const { select } = await inquirer.prompt<{ select: string }>({
        type: 'list',
        name: 'select',
        message: 'Choose a service:',
        choices: ['View Balance', 'Cash Withdraw', 'Cash Deposit', 'Exit']
      });
  
      if (select === 'Exit') break;
  
      const { accNumber } = await inquirer.prompt<{ accNumber: number }>({
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
          const { withdrawAmount } = await inquirer.prompt<{ withdrawAmount: number }>({
            type: 'input',
            name: 'withdrawAmount',
            message: 'Enter amount to withdraw:',
            validate: input => !isNaN(Number(input)) || 'Please enter a valid number'
          });
          console.log(bank.cashWithdraw(Number(accNumber), Number(withdrawAmount)));
          break;
        case 'Cash Deposit':
          const { depositAmount } = await inquirer.prompt<{ depositAmount: number }>({
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
  