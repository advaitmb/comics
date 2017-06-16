/* global d3  queue */

const table = d3.select('#career_chart').append('table');
table.append('thead');
table.append('tbody');

function numColor(t,cellType) {
  var cutoff=999999999.0;
  if(cellType=='num_males') cutoff=440.0
  else if(cellType=='num_females') cutoff=82.0
  else if(cellType=='percent_diff') cutoff=2554.79
  t=Math.abs(t)/cutoff;
  if(t>1.0) t=1.0;
  return d3.interpolateYlOrRd(t);
}
function cellColor(t) {
  console.log("Hello world")
  if(t.cl=='title') return 'white'
  else{
    var val=t.html.split("<span class='title'>")[1].split("</span>")[0];
    // return numColor(parseInt(val,10),t.cl)
    return numColor(parseFloat(val),t.cl)
  }
}

d3.csv("titles_big2.csv", function(error, titles) {
  if (error) throw error;

  const columns = [
    {
      head: 'Title',
      cl: 'title',
      html(row) {
        const sftitle = titles[row.title];
        const text = `<span class='title'>${row.title}</span>`;
        return text;
      },
    },
    {
      head: 'Male',
      cl: 'num_males',
      html(row) {
        const sfmales = titles[row.num_males];
        const text = `<span class='title'>${row.num_males}</span>`;
        return text;
      },
    },
    {
      head: 'Female',
      cl: 'num_females',
      html(row) {
        const sffemales = titles[row.num_females];
        const text = `<span class='title'>${row.num_females}</span>`;
        return text;
      },
    },
    {
      head: '% Difference',
      cl: 'percent_diff',
      html(row) {
        const sfmales = titles[row.percent_diff];
        const text = `<span class='title'>${row.percent_diff}</span>`;
        return text;
      },
    }
  ];

  table.call(renderTable);

  function renderTable(table) {
    const tableUpdate = table.select('thead')
      .selectAll('th')
        .data(columns);

    const tableEnter = tableUpdate
      .enter().append('th')
        .attr('class', d => d.cl)
        .text(d => d.head)
        .on('click', (d) => {
          let ascending;
          if (d.ascending) { ascending = false;}
          else { ascending = true;}
          d.ascending = ascending;
          titles.sort((a, b) => {
            if (ascending) {return d3.ascending(parseInt(a[d.cl],10), parseInt(b[d.cl],10));}
            return d3.descending(parseInt(a[d.cl],10), parseInt(b[d.cl],10));
          });
          table.call(renderTable);
        });

    const trUpdate = table.select('tbody').selectAll('tr')
      .data(titles);

    const trEnter = trUpdate.enter().append('tr');

    const trMerge = trUpdate.merge(trEnter);

    const tdUpdate = trMerge.selectAll('td')
      .data((row, i) => columns.map((c) => {
        const cell = {};
        d3.keys(c).forEach((k) => {
          cell[k] = typeof c[k] === 'function' ? c[k](row, i) : c[k];
        });
        return cell;
      }));

    var tdEnter = tdUpdate.enter().append('td');
    tdEnter
      .attr('class', d => d.cl)
      // .style("background-color", function(d) { return cellColor(d); })
      .style('border-bottom', '.5px solid white')
      .style('padding-right', '20px')
      .style('padding', '5px');

    tdEnter.merge(tdUpdate).html(d => d.html)
      .style("background-color", function(d) { return cellColor(d); })

  }
})
