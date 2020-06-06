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

// Record a user action or Sortable.js event
function record_event(event) {
      event_chain.push({
            'time': new Date().getTime(),
            'event': event
      });
}

// Load a note element
function load_note(text) {
      element = $('<li type="button" class="list-group-item list-group-item-action">Lorem ipsum</li>');
      element.text(text);
      return element;
}

// Convert list of note elements to an array of their contents
function note_elements_to_array(selection) {
      note_list = [];
      selection.each((i) => note_list.push(selection[i].innerText));
      return note_list;
}

// Replace a list of selected notes with another, even better, list
function replace_note_elements(selection, sorted_list) {
      sorted_list.reverse();
      // items are inserted in reverse order
      for (var i = 0; i < sorted_list.length; i++) {
            item = load_note(sorted_list[i]);
            item.insertAfter(selection[0]);
            Sortable.utils.select(item[0]);
      }
      selection.remove()
}

function update_single_button(condition, element, button_text, suffix) {
      if (!suffix) {
            suffix = '';
      }
      if (condition) {
            element.html(button_text + ' ' + selection_size + ' ' + suffix);
            element.prop('disabled', false);
      } else {
            element.html(button_text + ' ' + suffix);
            element.prop('disabled', true);
      }
}

function update_buttons() {
      selection_size = $('li.selected').length;

      update_single_button(selection_size > 0, $('#delete-notes-button'), 'Delete')
      update_single_button(selection_size > 1, $('#merge-notes-button'), 'Merge')
      update_single_button(selection_size > 0, $('#unmerge-notes-button'), 'Unmerge')
      update_single_button(selection_size > 0, $('#deselect-notes-button'), 'Deselect')
      update_single_button(selection_size > 0, $('#sort_az-notes-button'), 'Sort', 'A &#8594; Z')
      update_single_button(selection_size > 0, $('#sort_za-notes-button'), 'Sort', 'Z &#8594; A')

      // if (selection_size > 1) {
      //       $('#merge-notes-button').text('Merge ' + selection_size);
      //       $('#merge-notes-button').prop('disabled', false);
      // } else {
      //       $('#merge-notes-button').text('Merge');
      //       $('#merge-notes-button').prop('disabled', true);
      // }
      //
      // if (selection_size > 0) {
      //       $('#unmerge-notes-button').text('Unmerge ' + selection_size);
      //       $('#unmerge-notes-button').prop('disabled', false);
      // } else {
      //       $('#unmerge-notes-button').text('Unmerge');
      //       $('#unmerge-notes-button').prop('disabled', true);
      // }
      //
      // if (selection_size > 0) {
      //       $('#deselect-notes-button').text('Deselect ' + selection_size);
      //       $('#deselect-notes-button').prop('disabled', false);
      // } else {
      //       $('#deselect-notes-button').text('Deselect');
      //       $('#deselect-notes-button').prop('disabled', true);
      // }
}

// Delete selection
$('#delete-notes-button').click(() => {
      record_event({
            'type': 'delete',
            'items': $('li.list-group-item.selected')
      });
      $('li.list-group-item.selected').remove();
      update_buttons();
});
// Merge multiple notes into one
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

      update_buttons();
});
// Select all
$('#select-notes-button').click(() => {
      record_event({
            'type': 'select',
            'items': $('li')
      });
      $('li').each((index) => Sortable.utils.select($('li')[index]))
      update_buttons();
});
// Deselect all
$('#deselect-notes-button').click(() => {
      record_event({
            'type': 'deselect',
            'items': $('li')
      });
      $('li').each((index) => Sortable.utils.deselect($('li')[index]))
      update_buttons();
});
// Alphabetical sort
$('#sort_az-notes-button').click(() => {
      selection = $('li.selected');
      record_event({
            'type': 'sort_az',
            'items': selection
      });
      sorted_list = note_elements_to_array(selection).sort();
      replace_note_elements(selection, sorted_list);
});
// Reverse alphabetical sort
$('#sort_za-notes-button').click(() => {
      selection = $('li.selected');
      record_event({
            'type': 'sort_za',
            'items': selection
      });
      sorted_list = note_elements_to_array(selection).sort().reverse();
      replace_note_elements(selection, sorted_list);
});

// Load test data
notes = testdata.split('\n');
notes.forEach((note) => {
      $('#notes-panel').append(load_note(note));
})

// Convert list of note elements to text field
function write_to_text() {
      $('#text-panel').val(note_elements_to_array($('li')).join('\n'))
}

// Create sortable instance for notes list
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
      },
      onSelect: function(evt) {
            record_event(evt);
            write_to_text();
            update_buttons();
      },
      onDeselect: function(evt) {
            record_event(evt);
            write_to_text();
            update_buttons();
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
update_buttons();