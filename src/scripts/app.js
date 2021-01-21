/* começo do modelo de classe */

class Expense {
    constructor(ano,mes,dia,tipo,descricao,valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    /* criando lógica para validar dados */
    validateData() {
        /* a notação this[indice] pode ser usada para percorrer arrays e objetos em js */
        // vai percorrer sobre o objeto despesa (expense)
        for(let i in this) {
            // a notação this.atributo será acessado usando o [i]
            if(this[i] === '' || this[i] === null || this[i] === undefined) {
                return false
            } 
        }
        return true
    }
}
// fim modelo de classe das dispesas


class Db {
    
    /* começo da criação de chaves dinâmicas */
    constructor() {
        let id = localStorage.getItem('id')
        if (id === null) {
            localStorage.setItem('id', 0)
        }
    /* Portanto acima criamos um id com o método setitem passando a ''chave'' e o valor. Assim, sempre que a aplicação
    iniciar do começo, um id será criado. Nas demais o método getNextID se responsibilizará por criar o próximo ID para que
    na próxima inserção de objeto esse tenha um ID diferente.*/
    }
    
    getNextID() {
        /* portanto vamos criar a lógica para a criação automática do primeiro ID */
        let nextId = localStorage.getItem('id') // como não temos um id retornaria null
        return parseInt(nextId) + 1
        /* toda vez que o metodo for chamado, ele vai somar mais um no id */
        /* pra atualizar essa informação na hora de salvar vamos criar uma pequena lógica que
        recebe o retorno dessa função net id e coloca esse novo id gerado para subistituir o antigo */
    }

    SaveOnStorage(e) {
        /* acessando recurso de local storage */
        /* aqui temos o identificador do item que queremos salvar = ('expense) e através do stringify
        o objeto literal entre parênteses (e <-> objeto expense ) que será salvo no local storage */
        let newId = this.getNextID()
        localStorage.setItem(newId, JSON.stringify(e))
        // na hora de inserção no documento, sempre trabalhando com o próximo ID
        localStorage.setItem('id', newId)
    }
    getAllRegisters() { 
        // criando um array para salvar as despesas
        let expenses = new Array()
        // recuperar todas as despesas armazenadas em local storage
        let id = localStorage.getItem('id')
        
             for(let i = 1; i <= id; i++) {
                // recuperar a despesa para usa-la a cada id
                let expense = JSON.parse(localStorage.getItem(i)) // na primeira interação será 1, 2 e assim consecutivamente
                
                // verificar se indices foram pulados ou removidos
                if(expense === null) {
                continue               
                /* a propiedade continue pula essa repetição do laço, desconsiderando o que está abaixo, evitando
                assim, o push de um gasto nulo */
                }
                /* vamos adicionar o atributo id no array de despesas usando o i */
                expense.id = i // o i é equivalente ao ID que tá sendo salvo no array expenses
                expenses.push(expense)
                // vai salvar a despesa dentro do índice no array expenses
            }

        // retornando o array expenses com os objetos que foram transformados de JSON
        return expenses
    }
     search(expense) {
         let filtredExpenses = Array()
        filtredExpenses = this.getAllRegisters()
        /*-- filtedExpenses é um array que está recebendo a relação de todos os registros, que é um método já existente
        na nossa aplicação */

        
        /* agora vamos aplicar um filtro e subistituir o valor do array pelo filtro */
        if(expense.ano != '') {
            filtredExpenses = filtredExpenses.filter(e => e.ano == expense.ano ); 
        }
        /*--- la na função searchExpense nós estamos passando pra o search o objeto expense, que tem toddos os valores
        dos elementos capiturados por getelemnybyid lá no HTML, portanto, podemos acessar esses atributos pra ''cruzar''
        a informação do ano pesquisado com o ano do objeto literal vindo lá do index da aplicação */

        // agora pra mes, tipo, descricao, valor
        if(expense.dia != '') {
           filtredExpenses = filtredExpenses.filter(e => e.dia == expense.dia); 
        }
        if(expense.mes != '') {
            filtredExpenses = filtredExpenses.filter(e => e.mes == expense.mes); 
         }

        if(expense.tipo != '') {
            filtredExpenses = filtredExpenses.filter(e => e.tipo == expense.tipo); 
        }
        if(expense.descricao != '') {
            filtredExpenses = filtredExpenses.filter(e => e.descricao == expense.descricao); 
        }
        if(expense.valor != '') {
            filtredExpenses = filtredExpenses.filter(e => e.valor == expense.valor); 
        }

        
        return filtredExpenses
    }
    // método resposável pela remoção dum elemento em local storage
    remove(id) {
        localStorage.removeItem(id)
    }
}

let db = new Db()



function expenseRegister() {
    let ano = document.getElementById("ano");
    let mes = document.getElementById("mes");
    let dia = document.getElementById("dia");
    let tipo = document.getElementById("tipo");
    let descricao = document.getElementById("descricao");
    let valor = document.getElementById("valor");
  
    let expense = new Expense(ano.value,
      mes.value,
      dia.value,
      tipo.value,
      descricao.value,
      valor.value
      )
     /* criando validação de dados */
     if (expense.validateData()) {
        db.SaveOnStorage(expense)
        modal_change('Sucesso ao cadastrar os dados','Sucesso','Voltar','text-success','btn-success')
        $('#modal').modal('show')
        
        /*------ abordagem com for  ----------*/
        // para fins de limpar os campos após salvar os dados //
        /* o for in de um objeto literal vai sempre o i ser a chave do par chave/valor */
        for(let i in expense) {
            document.getElementById(i).value = ''
            /* por coincidencia o id no document HTML é o mesmo que os das chaves, logo podemos atribuir a eles
            o valor de nada */
           // console.log(i)    
        }
        /* sendo expense um objeto com os values capiturados da doom esse pode ser limpo na lógica */

    }
    else {
        // dialog de erro
        
        modal_change('Existem dados que não foram preenchidos','Erro na gravação','Voltar e corrigir','text-danger','btn-danger')
        // antes de mostrar o modal modificar o valor dele
        $('#modal').modal('show')
        console.log('dados invalidos');


    }
  }
  // função que carrega a lista de despesas
 function loadExpenseList(expenses = Array(), filtro = false){
    // recebendo o array de despesas
    if(expenses.length == 0 && filtro == false) {
    expenses = db.getAllRegisters()     
    }

     /* ------------ lista despesas página consulta ------ */
         // limpando as tabelas 
    let expenseList = document.getElementById('expenseList')
    expenseList.innerHTML = ''
    // lógica resonsável por limpar todas as tabelas 
    /* por expenseList ser um ID de tbody o innerHTML vai eliminar todos os filhos da tag */
    
      // percorrer o array expenses(capiturado do método search) e inserir uma tabela dinamicamente para cada valor de expenses
      expenses.forEach(function(e) {
         let row = expenseList.insertRow()

         row.insertCell(0).innerHTML = `${e.dia}/${e.mes}/${e.ano}` 
        
         switch(parseInt(e.tipo)) {
             case 1: e.tipo = 'Alimentação'
             break
             case 2: e.tipo = 'Educação'
             break
             case 3: e.tipo = 'Lazer'
             break
             case 4: e.tipo = 'Saúde'
             break
             case 5: e.tipo = 'Transporte'
             break 
            } // fim do switch

            row.insertCell(1).innerHTML = e.tipo 
            row.insertCell(2).innerHTML = e.descricao
            row.insertCell(3).innerHTML = e.valor
            // criar botao de exclusão
            let btn = document.createElement("button")
            btn.className= "btn btn-danger"
            btn.innerHTML = '<i class="fas fa-times"></i>'
            // adicionando um id a cada botao, o e representa expenses(array)
            btn.id = `id_expense${e.id}` //'id_expense' + e.id
            
            btn.onclick = function () {
              // remover despesa
              let id = this.id.replace('id_expense', '')
              
              db.remove(id)
             window.location.reload()   
              //alert(this.id)
            }
            row.insertCell(4).append(btn)
                        }// fim da arrow function
                 )// fim do forEach
        } // a função searchExpense
  


  // função do modal
function modal_change(modal_body,modal_title,modal_footer, modal_title_class, modal_button) {
 document.getElementById('modal-body').innerHTML = modal_body
 document.getElementById('modal-title').innerHTML = modal_title
 document.getElementById('modal-title').className = modal_title_class
 document.getElementById('modal-footer').innerHTML = modal_footer
 document.getElementById('modal-footer').className = modal_button           
 }
 // fim função modal
 
 
    /*-- a função searchExpense é disparada no consulta.html quando o usuário clica na lupa de pesquisa. Por sua vez
    essa função salva os valores digitados em cada campo e cria uma classe baseada nisso, usando o modelo de Expense, atribuindo
    a este os valores capiurados por documentGetElement. */

function searchExpense() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo= document.getElementById('tipo').value
    let descricao= document.getElementById('descricao').value
    let valor = document.getElementById('valor').value
   
    let expense = new Expense(ano,mes,dia,tipo,descricao,valor)

    // adicionando o método search de db ao expenses
    let expenses = db.search(expense)
    
    // chamando método de inserir tabelas
    this.loadExpenseList(expenses, true)
}
      
    