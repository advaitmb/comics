/* global d3  queue */

const table = d3.select('#career_chart').append('table');
table.append('thead');
table.append('tbody');


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
        .text(d => d.head);
        // .on('click', (d) => {
        //   let ascending;
        //   if (d.ascending) {
        //     ascending = false;
        //   } else {
        //     ascending = true;
        //   }
        //   d.ascending = ascending;
        //   qcew.sort((a, b) => {
        //     if (ascending) {
        //       return d3.ascending(a[d.cl], b[d.cl]);
        //     }
        //     return d3.descending(a[d.cl], b[d.cl]);
        //   });
        //   table.call(renderTable);
        // });

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

    const tdEnter = tdUpdate.enter().append('td');

    tdEnter
      .attr('class', d => d.cl)
      .style('background-color', '#fff')
      .style('border-bottom', '.5px solid white');

    tdEnter.merge(tdUpdate).html(d => d.html);
  }
})

