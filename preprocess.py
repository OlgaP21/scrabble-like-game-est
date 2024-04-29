from estnltk import Text
from estnltk.taggers import VabamorfAnalyzer
from estnltk.vabamorf.morf import synthesize
import locale

alphabet = ['a', 'b', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 'š', 'z', 'ž', 't', 'u', 'v', 'õ', 'ä', 'ö', 'ü']
morph_analyzer = VabamorfAnalyzer(guess=False, propername=False)
words = set()


def checkWordGeneral(word):
    if len(word) > 15:
        return False
    for letter in word:
        if letter not in alphabet:
            return False
    return True

def checkWord(word):
    text = Text(word)
    text.tag_layer(['words', 'sentences'])
    morph_analyzer.tag(text)
    if len(text.morph_analysis.partofspeech[0]) == 1:
        form = text.morph_analysis.form[0][0]
        part = text.morph_analysis.partofspeech[0][0]
        if (part == 'A' or part == 'N' or part == 'O' or \
            part == 'P' or part == 'S') and form == 'sg n':
            return True
        elif part == 'D' or part == 'I' or part == 'J' or \
             part == 'K' or part == 'G':
            return True
        elif part == 'V' and form == 'ma':
            return True
        return False
    else:
        part = text.morph_analysis.partofspeech[0]
        for i in range(len(part)):
            form = text.morph_analysis.form[0][i]
            if (part[i] == 'A' or part[i] == 'N' or \
                part[i] == 'O' or part[i] == 'P' or \
                part[i] == 'S') and form == 'sg n':
                return True
            elif (part[i] == 'D' or part[i] == 'I' or \
                  part[i] == 'J' or part[i] == 'K' or \
                  part[i] == 'G') and form == '':
                return True
            elif part[i] == 'V' and form == 'ma':
                return True
        return False

def generatePlural(word):
    text = Text(word)
    text.tag_layer(['words', 'sentences'])
    morph_analyzer.tag(text)
    if len(text.morph_analysis.partofspeech[0]) == 1:
        part = text.morph_analysis.partofspeech[0][0]
        if part == 'A' or part == 'N' or part == 'O' or \
           part == 'P' or part == 'S':
            plural = synthesize(word, 'pl n')
            for p in plural:
                words.add(p)
    else:
        part = text.morph_analysis.partofspeech[0]
        for i in range(len(part)):
            if part[i] == 'A' or part[i] == 'N' or \
               part[i] == 'O' or part[i] == 'P' or \
               part[i] == 'S':
                plural = synthesize(word, 'pl n')
                for p in plural:
                    words.add(p)


with open('lemma_alfabeetilises.txt', 'r', encoding='utf-8-sig') as file:
    for line in file:
        word = line.strip().split()[1]
        if not checkWordGeneral(word):
            continue
        if not checkWord(word):
            continue
        words.add(word)
        generatePlural(word)

locale.setlocale(locale.LC_ALL, "")

content = list(words)
content.sort(key=locale.strxfrm)

with open('dictionary.txt', 'w', encoding='utf-8') as file:
    file.write('\n'.join(content))
