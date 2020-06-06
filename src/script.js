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

groups = {};
event_chain = [];

// sortable.on($('#notes-panel')[0],'onEnd',(e)=>{console.log(e)})
// Sortable.utils.on($('#notes-panel').children()[0],'onStart',(events)=>{console.log(true)})

function record_event(event) {
      event_chain.push({
            'time': new Date().getTime(),
            'event': event
      });
}

$('#delete-notes-button').click(() => {
      $('li.list-group-item.selected').remove();
});

$('#merge-notes-button').click(() => {
      selected = $('li.selected')
      for (var i = 1; i < selected.length; i++) {
            selected.get(0).innerText += "\n" + selected.get(i).innerText
            selected.get(i).remove()
      }
});

notes = testdata.split('\n');
notes.forEach((note) => {
      item = $('<li type="button" class="list-group-item list-group-item-action">Lorem ipsum</li>');
      item.text(note);
      $('#notes-panel').append(item);
})
sortable = Sortable.create($('#notes-panel')[0], {
      multiDrag: true,
      selectedClass: "selected",
      animation: 150,
      onStart: function(evt) {
            record_event(evt)
      }
});

// https://github.com/SortableJS/Sortable/issues/1612#issuecomment-526477250
// let deselectMultiDrag = sortable.multiDrag._deselectMultiDrag;
// document.removeEventListener('pointerup', deselectMultiDrag, false);
// document.removeEventListener('mouseup', deselectMultiDrag, false);
// document.removeEventListener('touchend', deselectMultiDrag, false);

// Stop event propagation so clicks in sidebar don't deselect notes
// https://github.com/SortableJS/Sortable/issues/1612#issuecomment-533777362
$('nav#sidebar').on('pointerup mouseup touchend', function(event) {
      event.stopPropagation();
});

$('.toast').toast({
      'delay': 10000
})