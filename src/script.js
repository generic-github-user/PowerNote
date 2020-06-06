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
      record_event({
            'type': 'delete',
            'items': $('li.list-group-item.selected')
      });
      $('li.list-group-item.selected').remove();
});

$('#merge-notes-button').click(() => {
      selected = $('li.selected');
      record_event({
            'type': 'merge',
            'items': selected
      });

      for (var i = 1; i < selected.length; i++) {
            selected.get(0).innerText += "\n" + selected.get(i).innerText
            selected.get(i).remove()
      }
});
$('#select-notes-button').click(() => {
      record_event({
            'type': 'select',
            'items': $('li')
      });
      $('li').each((index) => Sortable.utils.select($('li')[index]))
});
$('#deselect-notes-button').click(() => {
      record_event({
            'type': 'deselect',
            'items': $('li')
      });
      $('li').each((index) => Sortable.utils.deselect($('li')[index]))
});
$('#sort_az-notes-button').click(() => {
      current_list = [];
      selection = $('li.selected');

      record_event({
            'type': 'sort_az',
            'items': selection
      });

      for (var i = 0; i < selection.length; i++) {
            current_list.push(selection[i].innerText);
      }
      sorted_list = current_list.sort().reverse();

      // items are inserted in reverse order
      for (var i = 0; i < sorted_list.length; i++) {
            item = $('<li type="button" class="list-group-item list-group-item-action">Lorem ipsum</li>');
            item.text(sorted_list[i]);
            item.insertAfter(selection[0]);
            Sortable.utils.select(item[0]);
      }
      selection.remove()
});

notes = testdata.split('\n');
notes.forEach((note) => {
      item = $('<li type="button" class="list-group-item list-group-item-action">Lorem ipsum</li>');
      item.text(note);
      $('#notes-panel').append(item);
})

function write_to_text() {
      current_list = [];
      for (var i = 0; i < $('li').length; i++) {
            current_list.push($('li')[i].innerText);
      }
      $('#text-panel').val(current_list.join('\n'))
}

sortable = Sortable.create($('#notes-panel')[0], {
      multiDrag: true,
      selectedClass: "selected",
      animation: 150,
      onStart: function(evt) {
            record_event(evt);
            write_to_text();
      },
      onSort: function(evt) {
            record_event(evt);
            write_to_text();
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

write_to_text();