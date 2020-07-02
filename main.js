console.log('test');

window.addEventListener('load', () => {
  let lineCount = 1;
  const grid = document.createElement('div');
  grid.id = 'dom-console';
  document.body.appendChild(grid);
  const style = document.createElement('style');
  style.textContent = /*css*/ `
   
    #dom-console {
      margin: 0 auto;
      max-width: 100%;
      display: grid;
      grid: auto / fit-content(1px) auto;
      grid-auto-flow: row;
      font-size: 1.1rem;
      width: 700px;
      max-width: 100%;
    }
    #dom-console div {
      color: black;
      background: #f5f5f5;
      padding: 0.4rem;
      margin: 0;
    }
    #dom-console div:nth-child(odd) {
      text-align: center;
      font-weight: bold;
      background: #eaeaea;
    }
    #dom-console div:nth-child(even) {
      white-space: pre-wrap;
      overflow-wrap: break-word;
      overflow: hidden;
      hyphens: auto;
    }

    /* ----- Round corner ----- */

    #dom-console div:nth-child(1) {
      border-top-left-radius: 7px;
    }
    #dom-console div:nth-child(2) {
      border-top-right-radius: 7px;
    } 
    #dom-console div:nth-last-child(2) {
      border-bottom-left-radius: 7px;
    }
    #dom-console div:nth-last-child(1) {
      border-bottom-right-radius: 7px;
    }

    /* ----- Special line ----- */

    #dom-console div.err:nth-child(odd) {
      background: #F6A3A2;
    }
    #dom-console div.err:nth-child(even) {
      color: #ef5350;
      background: #FCDADA;
    }
    #dom-console div.warn:nth-child(odd) {
      background: #ffce85;
    }
    #dom-console div.warn:nth-child(even) {
      color: #ffa726;
      background: #ffefd6;
    }
    #dom-console div.success:nth-child(odd) {
      background: #B9DFBB;
    }
    #dom-console div.success:nth-child(even) {
      color: #66bb6a;
      background: #E3F2E4;
    }
    #dom-console div.info:nth-child(odd) {
      background: #A5D5F3;
    }
    #dom-console div.info:nth-child(even) {
      color: #1982C4;
      background: #DBEEFA;
    }
    
    /* ----- Input line ----- */

    #dom-console div.query {
      border: 1px solid #7d7d7d;
      border-bottom: none;
      font-style: italic;
      background: #f5f5f5;
    }
    #dom-console div:query:nth-child(odd) {
      border-right: none;
    }
    #dom-console div.query:nth-child(even) {
      border-left: none;
    }
    #dom-console div.input {
      border: 1px solid #7d7d7d;
      border-top: none;
      background: white;
    }
    #dom-console div.input:nth-child(odd) {
      border-right: none;
      font-size: 1.1rem;
      font-weight: bolder;
    }
    #dom-console div.input:nth-child(even) {
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

  function prettyFormat(object) {
    return JSON.stringify(object);
  }

  // Add a new line on the dom console
  function addConsoleLine(content, type) {
    if (typeof content == 'object') {
      content = prettyFormat(content);
    }
    // Add the line number
    const lineInfo = document.createElement('div');
    lineInfo.textContent = lineCount++;
    lineInfo.className = type;
    grid.appendChild(lineInfo);
    // Add the line content
    const lineContent = document.createElement('div');
    lineContent.textContent = content;
    lineContent.className = type;
    grid.appendChild(lineContent);
  }

  // Add an input line
  function addInputLine(query) {
    // Add the query line
    const queryInfo = document.createElement('div');
    queryInfo.textContent = '?';
    queryInfo.className = 'query';
    grid.appendChild(queryInfo);
    const queryContent = document.createElement('div');
    queryContent.textContent = query;
    queryContent.className = 'query';
    grid.appendChild(queryContent);
    // Add the input line
    const inputInfo = document.createElement('div');
    inputInfo.textContent = '›';
    inputInfo.className = 'input';
    grid.appendChild(inputInfo);
    const inputContent = document.createElement('div');
    const input = document.createElement('input');
    inputContent.appendChild(input);
    inputContent.className = 'input';
    grid.appendChild(inputContent);
    // Set up promise callback
    input.focus();
    return new Promise((resolve, reject) => {
      input.onkeydown = event => {
        if (event.key === 'Enter') {
          grid.removeChild(queryInfo);
          grid.removeChild(queryContent);
          grid.removeChild(inputInfo);
          grid.removeChild(inputContent);
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
    grid.textContent = '';
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
  if (window.main) {
    window.main();
  }
});
