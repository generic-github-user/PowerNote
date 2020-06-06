var testdata = '\
inheritors\
\nsolvency\
\nmalfeasance\
\n\
\nconcomitant\
\nglass castle\
\ndiminutive\
\ncommissary\
\nlapidary\
\ncatchetism\
\nsurreptitious\
\npreeminent\
\ndissonance\
\npretense\
\nhaberdashery\
\nfallow\
\nlugubrious\
\ncantankerous\
\n\
\nnon sequiturs\
\naplomb\
\nslovenly\
\nsupple\
\nvicariously\
\nlaconic\
\nattuned\
\ntact\
\nzany\
\nmotile\
\nexigence';

function generate_id() {
      return Math.floor(Math.random() * 1e16).toString(16)
}
notes = testdata.split('\n');
notes.forEach((note) => {
      item = $('<li type="button" class="list-group-item list-group-item-action">Lorem ipsum</li>');
      item.text(note);
      $('#notes-panel').append(item);
})
Sortable.create($('#notes-panel')[0], {
      multiDrag: true,
      selectedClass: "selected",
      animation: 150
});