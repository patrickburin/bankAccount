import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";

operation();

function operation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que você deseja fazer?",
        choices: [
          "Criar conta",
          "Consultar saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["action"];
      ("");
      if (action === "Criar conta") {
        createAccount();
      } else if (action === "Consultar saldo") {
        getAccountBalance();
      } else if (action === "Depositar") {
        deposit();
      } else if (action === "Sacar") {
        withDraw();
      } else if (action === "Sair") {
        console.log(chalk.bgBlue.black("Obrigado por usar o nosso banco!"));
        process.exit();
      }
    })
    .catch((err) => {
      err;
    });
}

//create account
function createAccount() {
  console.log(chalk.bgGreen.black("Parabéns por escolher o nosso banco!"));
  console.log(chalk.green("Defina as opções da sua conta a seguir:"));

  buildAccount();
}

function buildAccount() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite o nome da sua conta:",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      if (!fs.existsSync("accounts")) {
        fs.mkdirSync("accounts");
      }

      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(
          chalk.bgRed.black("Já existe uma conta com esse nome, tente outro!")
        );
        buildAccount();
      }

      fs.writeFileSync(
        `accounts/${accountName}.json`,
        `{"balance": 0}`,
        function (err) {
          console.log(err);
        }
      );

      console.log(chalk.green("Conta criada com sucesso!"));
      operation();
    });
}

//deposit
function deposit() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite o nome da sua conta:",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      if (!checkAccount(accountName)) {
        return deposit();
      }

      inquirer
        .prompt([
          {
            name: "amount",
            message: "Qual o valor do depósito?",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];

          addAmout(accountName, amount);
          operation();
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

function addAmout(accountName, amount) {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(chalk.bgRed.black("Valor inválido, tente novamente!"));
    return deposit();
  }

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err);
    }
  );

  console.log(chalk.green(`Depósito de R$${amount} realizado com sucesso!`));
}

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf-8",
    flag: "r",
  });

  return JSON.parse(accountJSON);
}

//get account balance
function getAccountBalance() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite o nome da conta:",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      if (!checkAccount(accountName)) {
        return getAccountBalance();
      }

      const accountData = getAccount(accountName);

      console.log(
        chalk.bgBlue.black(
          `Olá ${accountName} o saldo da sua conta é: R$${accountData.balance}`
        )
      );
      operation();
    })
    .catch((err) => console.log(err));
}

//withDraw
function withDraw(){
  inquirer.prompt([
    {
      name: "accountName",
      message: "Digite o nome da conta:",
    }
  ])
  .then((answer) => {
    const accountName = answer["accountName"];

    if (!checkAccount(accountName)) {
      return withDraw();
    }

    inquirer.prompt([
      {
        name: "amount",
        message: "Digite o valor do saque:",
      }
    ]).then((answer) => {
      const amount = answer["amount"];

      removeAmount(accountName, amount);
    }).catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));
}

function removeAmount(accountName, amount) {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(chalk.bgRed.black("Valor inválido, tente novamente!"));
    return withDraw();
  }

  if(accountData.balance < amount){
    console.log(chalk.bgRed.black("Saldo insuficiente!"));
    return withDraw();
  }

  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err);
    }
  );

  console.log(chalk.green(`Olá ${accountName}, o saque de R$${amount} realizado com sucesso!`));
  operation();
}

//check account
function checkAccount(accountName) {
  if (fs.existsSync(`accounts/${accountName}.json`)) {
    return true;
  } else {
    console.log(chalk.bgRed.black("Conta não encontrada, tente novamente!"));
    return false;
  }
}