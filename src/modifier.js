document.getElementById('convert-btn').addEventListener('click', function() {
    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        console.log( file )

        reader.onload = function(e) {
            const content = e.target.result;
            const allDayContent = convertToAllDay(content);
            downloadModifiedFile(allDayContent, file.name);
        };

        reader.readAsText(file);
    } else {
        alert('Please select a file first.');
    }
});

function convertToAllDay(icsContent) {
    // Split the content by line and start processing
    const lines = icsContent.split(/\r\n|\n|\r/);
    let inEvent = false;
    let newContent = [];

    for (let line of lines) {
        if (line.startsWith('BEGIN:VEVENT')) {
            inEvent = true;
        }

        if (inEvent) {
            // Modify DTSTART and DTEND
            if (line.startsWith('DTSTART') || line.startsWith('DTEND')) {
                const datePart = line.split(':')[1].substring(0, 8);
                line = line.split(':')[0].split(';')[0] + ';' + 'VALUE=DATE:' + datePart;
            }

            if (line.startsWith('END:VEVENT')) {
                inEvent = false;
            }
        }

        newContent.push(line);
    }

    return newContent.join('\r\n');
}

function downloadModifiedFile(content, fileName) {
    const blob = new Blob([content], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById('downloadLink');

    downloadLink.href = url;
    downloadLink.download = fileName + '_allDay.ics';
    downloadLink.className = "";
}
