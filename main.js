window.addEventListener('load', () => {
  let lineCount = 1;
  const table = document.createElement('table');
  table.id = 'dom-console';
  table.setAttribute('cellspacing', 0);
  document.body.appendChild(table);
  const style = document.createElement('style');
  style.textContent = /*css*/ `
      #dom-console {
        padding: 16px;
        margin: 0 auto;
        width: 100%;
        max-width: 100%;
        font-size: 1.1rem;
        table-layout: fixed;
      }
      #dom-console td {
        color: black;
        background: #f5f5f5;
        padding: 0.4rem;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        hyphens: auto;
      }
      #dom-console td:nth-child(1) {
        text-align: center;
        color: black;
        font-weight: bold;
        background: #eaeaea;
        white-space: nowrap;
        width: 0.7em;
      }

      /* ----- Round corner ----- */

      #dom-console tr:first-child td:nth-child(1) {
        border-top-left-radius: 7px;
      }
      #dom-console tr:first-child td:nth-child(2) {
        border-top-right-radius: 7px;
      } 
      
      #dom-console tr:last-child td:nth-child(1) {
        border-bottom-left-radius: 7px;
      }
      #dom-console tr:last-child td:nth-child(2) {
        border-bottom-right-radius: 7px;
      }

      /* ----- Special line ----- */

      #dom-console tr.err td:nth-child(1) {
        background: #F6A3A2;
      }
      #dom-console tr.err td:nth-child(2) {
        color: #ef5350;
        background: #FCDADA;
      }
      #dom-console tr.warn td:nth-child(1) {
        background: #ffce85;
      }
      #dom-console tr.warn td:nth-child(2) {
        color: #ffa726;
        background: #ffefd6;
      }
      #dom-console tr.success td:nth-child(1) {
        background: #B9DFBB;
      }
      #dom-console tr.success td:nth-child(2) {
        color: #66bb6a;
        background: #E3F2E4;
      }
      #dom-console tr.info td:nth-child(1) {
        background: #A5D5F3;
      }
      #dom-console tr.info td:nth-child(2) {
        color: #1982C4;
        background: #DBEEFA;
      }
      
      /* ----- Input line ----- */

      #dom-console tr.query td {
        border: 1px solid #7d7d7d;
        border-bottom: none;
        font-style: italic;
        background: #f5f5f5;
      }
      #dom-console tr.query td:nth-child(1) {
        border-right: none;
      }
      #dom-console tr.query td:nth-child(2) {
        border-left: none;
      }
      #dom-console tr.input td {
        border: 1px solid #7d7d7d;
        border-top: none;
        background: white;
      }
      #dom-console tr.input td:nth-child(1) {
        border-right: none;
        font-size: 1.1rem;
        font-weight: bolder;
      }
      #dom-console tr.input td:nth-child(2) {
        border-left: none;
        padding: 0;
      }
      #dom-console input {
        background: none;
        font-family: serif;
        margin: 0;
        padding: 0.4rem;
        width: 100%;
        font-size: 1.1rem; 
        box-sizing: border-box;
        border: none;
        outline: none;      
      }
    `;
  document.head.appendChild(style);

  // Add a new line on the dom console
  function addConsoleLine(content, type) {
    // Create the console line
    const row = document.createElement('tr');
    row.className = type;
    const lineInfo = document.createElement('td');
    lineInfo.textContent = lineCount++;
    row.appendChild(lineInfo);
    const lineContent = document.createElement('td');
    lineContent.textContent = content;
    row.appendChild(lineContent);
    // Append the line to the table
    table.appendChild(row);
  }

  // Add an input line
  function addInputLine(query) {
    // Create the query line
    const queryRow = document.createElement('tr');
    queryRow.className = 'query';
    const queryInfo = document.createElement('td');
    queryInfo.textContent = '?';
    queryRow.appendChild(queryInfo);
    const queryContent = document.createElement('td');
    queryContent.textContent = query;
    queryRow.appendChild(queryContent);
    // Create the input line
    const inputRow = document.createElement('tr');
    inputRow.className = 'input';
    const inputInfo = document.createElement('td');
    inputInfo.textContent = '›';
    inputRow.appendChild(inputInfo);
    const inputContent = document.createElement('td');
    const input = document.createElement('input');
    inputContent.appendChild(input);
    inputRow.appendChild(inputContent);
    // Add both to the table
    table.appendChild(queryRow);
    table.appendChild(inputRow);
    // Set up promise callback
    input.focus();
    return new Promise((resolve, reject) => {
      input.onkeydown = event => {
        if (event.key === 'Enter') {
          table.removeChild(queryRow);
          table.removeChild(inputRow);
          resolve(input.value);
        }
      };
    });
  }

  // Create global console function
  window.print = data => addConsoleLine(data);
  window.err = data => addConsoleLine(data, 'err');
  window.warn = data => addConsoleLine(data, 'warn');
  window.success = data => addConsoleLine(data, 'success');
  window.info = data => addConsoleLine(data, 'info');
  window.input = query => addInputLine(query);
  window.clear = () => {
    table.textContent = '';
    lineCount = 1;
  };

  // Link normal console function
  window.console.log = data => window.print(data);
  window.console.error = data => window.err(data);
  window.console.warn = data => window.warn(data);
  window.console.info = data => window.info(data);

  // Link global error handler
  window.onerror = event => window.err(event);

  // Call the main function if it exist
  if (main) {
    main();
  }
});
