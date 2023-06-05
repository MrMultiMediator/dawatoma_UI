import sys
from dawatoma import NoteDict

def get_key(val, my_dict):
   
    for key, value in my_dict.items():
        if val == value:
            return key
 
    return "key doesn't exist"

def gen_css_grid(n_cols):
    nd = NoteDict.copy()
    n_rows = max(nd.values())+1
    with open('piano_grid_py.css','w') as g:
        for i in range(n_rows):
            for j in range(n_cols):
                g.write(f".g{i}_{j}")
                if j == 0:
                    g.write(" {\n  background-color: #FFFFFF;\n")
                    g.write("  border-top: 1px solid black;\n")
                    g.write("  border-left: 1px solid black;\n")
                else:
                    g.write(" {\n  background-color: #0000FF;\n")
                g.write(f"  grid-column: {j+1} / {j+2}\n")
                g.write(f"  grid-row: {i+1} / {i+2}\n")
                g.write('  z-index: 1;\n')
                g.write("}\n")

def gen_html_css_grid(n_cols):
    font_size = 3

    nd = NoteDict.copy()
    n_rows = max(nd.values())+1
    nd_indexes = list(reversed(range(max(nd.values())+1)))
    print(f"There are {n_rows} rows")

    with open('css_grid.html','w') as g:
        for i in range(n_rows):
            for j in range(n_cols):
                if j == 0: # Write the note string at the beginning of the row
                    g.write(f'  <div class="g{i}_{j}"><font size="{font_size}" face="Arial">{get_key(nd_indexes[i], nd)}</font></div>\n')
                else:
                    g.write(f'  <div class="g{i}_{j}"></div>\n')
        g.write('</div>\n</body>\n</html>\n')

def main(argv):
    gen_css_grid(int(argv[1]))
    gen_html_css_grid(int(argv[1]))

if __name__ == '__main__':
    main(sys.argv)


"""
.e {
  background-color: #F0FFFF; /* cells need a bg color for this to work */
  grid-column: 1 / 2;
  grid-row: 3 / 4;
}
"""