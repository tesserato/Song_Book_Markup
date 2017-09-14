# SBM 

## Song Book Markup is an embrionary attempt to establish a markup language / environment for chords and lyrics style songbooks - refer to the outstanding Brazillian tab site [Cifraclub](https://www.cifraclub.com.br/) for an idea of the final functionality intended.

Early pre-alpha stage!!

Implemented:
- | (pipe) char before text marks it as chords: ctrl + keys move them around individually

- ! (exclamation mark) anywhere in a line marks title

- all other chars can be used as lyrics

- **while line has focus:**  Enter creates new line, ctrl+del deletes it

- ctrl+enter creates new song

- esc toggles prettymode(for printing, reading tab, and showing chords on hover(only D avaiable this time! reads png image from folder, image must have the same name as the chord)) / editing mode

- you can load txt files (observe example tab for the especific format)

- you can also save them

That's pretty much it for now. Feel free to extend functionality at will. Css can(and must!) be edited for better looks

## Roadmap:

- automatic chord generation
- better looks via .css
- maybe port to java