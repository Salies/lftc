const list = $(".list");
const pattern = new RegExp("^[a-z]*[A-Z]?$");

$(".add-rule").addEventListener("click", (e) => {
  list.insertAdjacentHTML(
    "beforeend",
    `<div class="max-w-lg p-0.5 mx-auto">
    <input type="text" value="S" class="w-16 bg-gray-200 rounded-lg text-center text-xl py-0.5" />
    <span>→</span>
    <input type="text" placeholder="λ" oninput="validateRule(this)" class="rule w-28 bg-gray-200 rounded-lg text-center text-xl pt-0.5" />
  </div>`
  );
});

const validateRule = (el) => {
  const valid = pattern.test(el.value);
  if (valid) el.classList.remove("bg-red-300");
  else el.classList.add("bg-red-300");

  validateInput();
  return valid;
};

const validateAllRules = () => {
  const rules = document.querySelectorAll(".rule");
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

const validateInput = () => {
  const { value: grammar } = $(".input-grammar");
  const treeDiv = $(".tree");
  const areRulesValid = validateAllRules();
  console.log("areRulesValid", areRulesValid);
  console.log("grammar", grammar);
  // Todo continue here.

  const helloWorld = "Hello World";
  treeDiv.innerHTML += `<div class="text-2xl">${helloWorld}</div>`;
};
