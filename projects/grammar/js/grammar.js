const list = $(".list");
const resultTree = document.getElementById('result-tree');
const pattern = new RegExp("^[a-z]*[A-Z]?$");
let tryAgain = true;

$(".add-rule").addEventListener("click", (e) => {
  list.insertAdjacentHTML(
    "beforeend",
    `<div class="max-w-lg p-0.5 mx-auto rule">
    <input type="text" value="S" maxlength="1" oninput="upperRule(this)" class="w-16 bg-gray-200 rounded-lg text-center text-xl py-0.5" />
    <span>→</span>
    <input type="text" placeholder="λ" oninput="validateRule(this)" class="right-rule w-28 bg-gray-200 rounded-lg text-center text-xl pt-0.5" />
  </div>`
  );
});

const validateRule = (el) => {
  tryAgain = true;
  const valid = pattern.test(el.value);
  /*if (valid) el.classList.remove("bg-red-300");
  else el.classList.add("bg-red-300");

  validateInput();*/
  if(valid) {
    el.classList.remove("bg-red-300");
    validateInput();
  }
  else {
    el.classList.add("bg-red-300");
    resultTree.innerText = 'Entrada inválida';
  }
  return valid;
};

const validateAllRules = () => {
  const rules = document.querySelectorAll(".right-rule");
  let allValid = true;
  for (let rule of rules) {
    const isValidRule = pattern.test(rule.value);
    if (!isValidRule) {
      allValid = false;
      break;
    }
  }
  return allValid;
};

const upperRule = (el) => {
  el.value = el.value.toUpperCase();
  validateRule(el.parentNode.childNodes[5]); // validateInput no leftside
};

// Função da biblioteca
const displayTree = (tree) => {
	if (!tree.subtrees || tree.subtrees.length == 0)
		return '<li ><a href="#" class=\'bg-green-500\'>' + tree.root + '</a></li>';

	const builder = [];
	builder.push('<li><a href="#">');
	builder.push(tree.root);
	builder.push('</a>');
	builder.push('<ul>');
	for (const subtree in tree.subtrees)
		builder.push(displayTree(tree.subtrees[subtree]));
	builder.push('</ul>');
	builder.push('</li>');
	return builder.join('');
};

const getUserInput = () => {
  let i = $(".user-input").value;
  if(!tryAgain) i += "λ";
  return i.split("");
};

const validateInput = () => {
  const areRulesValid = validateAllRules();
  if(!areRulesValid) return;
  // Transformando as regras inseridas em regras legíveis pela biblioteca
  const rules = document.querySelectorAll(".rule");
  let parsedRules = [], usedLeftSide = [];
  for (let rule of rules) {
    let children = rule.getElementsByTagName('input');
    // rv -- a biblioteca separa os tokens por um espaço
    let lv = children[0].value, rv = children[1].value.split("").join(" ");
    // Se for vazio, põe λ
    if(rv === "")
      rv = "λ";
    let indexLv = usedLeftSide.indexOf(lv);
    if(indexLv === -1) {
      usedLeftSide.push(lv);
      parsedRules.push(lv + " -> " + rv);
      continue;
    }
    parsedRules[indexLv] += " | " + rv;
  }

  /* 
    O código abaixo foi adaptado dos exemplos da biblioteca.
    É parcialmente de nossa autoria, mas por não ter originado de nós, deixamos os
    devidos créditos para não incorrermos em plágio:
    https://github.com/lagodiuk/earley-parser-js
  */
  const tokenStream = getUserInput();

  const grammar = new REGULAR_GRAMMAR.Grammar(parsedRules);

  const rootProduction = 'S';
  const chart = REGULAR_GRAMMAR.parse(
    tokenStream,
    grammar,
    rootProduction,
  );

  const state = chart.getFinishedRoot(rootProduction);
  resultTree.innerHTML = '';
  if (state) {
    const trees = state.traverse();
    for (const tree in trees) {
      resultTree.innerHTML +=
        '<div class="tree" id="displayTree"><ul>' +
        displayTree(trees[tree]) +
        '</ul></div></br>';
    }
    return;
  }

  if(parsedRules.join("").includes("λ") && tryAgain){
    tryAgain = false;
    validateInput();
    return;
  }

  resultTree.innerText = 'Entrada inválida'
};

validateInput(); // para a primeira execução

/*
TODO (mas f****): proibir lambda
TODO (mas f****): remover (só da F5, mano)
*/