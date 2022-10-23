const $ = (id) => document.getElementById(id);

const displayTree = (tree) => {
	if (!tree.subtrees || tree.subtrees.length == 0)
		return '<li><a href="#">' + tree.root + '</a></li>';

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

const main = () => {
	const input = $('user-input');
	input.addEventListener('input', function (e) {
		const stream = e.target.value;
		const tokenStream = stream.trim().split(' ');

		const rules = $('grammar-rules').value.trim().split('\n');

		const grammar = new tinynlp.Grammar(rules);

		const rootProduction = 'S';
		const chart = tinynlp.parse(tokenStream, grammar, rootProduction);

		const state = chart.getFinishedRoot(rootProduction);
		const resultTree = document.getElementById('result-tree');
		resultTree.innerHTML = '';
		if (state) {
			const trees = state.traverse();
			for (const tree in trees) {
				// console.log(JSON.stringify(trees[i]));
				resultTree.innerHTML +=
					'<div class="tree" id="displayTree"><ul>' +
					displayTree(trees[tree]) +
					'</ul></div></br>';
			}
		} else resultTree.innerText = 'Entrada inválida';
	});
};

main();
