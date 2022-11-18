"use strict";
function createParagraph(colored) {
    var p = document.createElement("p");
    p.className = "code-line";
    while (true) {
        let cIndex = colored.indexOf("|ç");
        var b = document.createElement("b");
        b.innerText = colored.slice(0, cIndex == -1 ? colored.length : cIndex);
        b.style.color = highlightColors[colored[cIndex + 2]];
        p.appendChild(b);
        if (cIndex == -1) {
            break;
        }
        colored = colored.slice(colored.indexOf("|ç") + 3);
        if (colored.length == 0) {
            break;
        }
    }
    return p;
}
function stringToCodeBlock(parent, str, sameLine = false) {
    let index = 0;
    while (true) {
        let end = str.indexOf("\n", index);
        if (end == -1) {
            break;
        }
        let div = document.createElement("div");
        div.className = "code-line";
        if (str[end - 1] == "{" || str[end - 4] == "{") {
            let openIndex = end + 1;
            let closeIndex = end + 1;
            while (true) {
                let newOpenIndex = str.indexOf("{", openIndex) + 1;
                if (newOpenIndex < openIndex) {
                    closeIndex = str.indexOf("}", closeIndex) + 1;
                    break;
                }
                openIndex = newOpenIndex;
                closeIndex = str.indexOf("}", closeIndex) + 1;
                if (openIndex > closeIndex) {
                    break;
                }
            }
            closeIndex--;
            let newStr = str.slice(end + 1, closeIndex);
            if (!sameLine) {
                parent.insertAdjacentElement("beforeend", createParagraph(str.slice(index, end)));
            }
            if (str[str.indexOf("\n", closeIndex) - 4] == "{") {
                sameLine = true;
            }
            else {
                sameLine = false;
            }
            stringToCodeBlock(div, newStr, sameLine);
            parent.insertAdjacentElement("beforeend", div);
            parent.insertAdjacentElement("beforeend", createParagraph(str.slice(closeIndex, str.indexOf("\n", closeIndex))));
            // parent.insertAdjacentElement("beforeend", document.createElement("br"));
            div.classList.add("ident");
            end = closeIndex + 1;
        }
        else {
            var colored = str
                .slice(index, end)
                .replace(/\|o/g, "{")
                .replace(/\|c/g, "}");
            div.appendChild(createParagraph(colored));
            // div.innerText = str;
            if (div.innerText == " ") {
                parent.insertAdjacentElement("beforeend", document.createElement("br"));
            }
            else {
                if (div.innerText.includes("|g")) {
                    div.classList.add("correctness-highlight");
                    div.innerText = div.innerText.replace(/\|g/g, "");
                }
                parent.insertAdjacentElement("beforeend", div);
            }
        }
        index = end + 1;
    }
}
let iterativeCorrectness = `classe item {
  int letra;
  int anterior;
  int valor;
  int contador;
  int code;
}
 
count(mainstring, substring, m, n) {
  variável dicionário = novo dicionário<inteiro, item>
  variável anterior = null
  dicionário[-1] = item com |ocode = -1, valor = 1|c
  for(int i = 0; i < n; i++) {
    variável index = substring[i]
    se index for uma chave existente no dicionário {
      variável contador = dicionário[index].contador
      dicionário[index].contador = contador + 1
      index = index + contador * 256
    }
    variável item
    se i == 0 {
      item = item com |oletra = substring[i], code = index, valor = 0, contador = 1, anterior = -1|c
    } caso contrário {
      item = item com |oletra = substring[i], code = index, valor = 0, contador = 1, anterior = anterior.code|c
    }
    anterior = item
    dicionário[index] = item
  }
 
  for(int i = 0; i < m; i++) {
    variável valorAnterior = 0;
    para todos os itens do dicionário com letra igual mainstring[i] {
      variável novoValor = item.valor;
      se item.letra == dicionário[item.anterior].letra {
        item.valor = item.valor + valorAnterior;
      } caso contrário {
        item.valor = item.valor + dicionário[item.anterior].valor;
      }
      valorAnterior = novoValor;
    }
  }
 
  retorna anterior.valor
}
`;
let dynamicCorrectness = `algoritmo |ç0countOccurrencesDP|ç1 (|ç0mainstring|ç2,|ç0 substring|ç2,|ç0 m|ç2,|ç0 n|ç2) {|ç0
    variável|ç0 lookup|ç2 =|ç0 matriz de inteiro com dimensões|ç3 [m+1][n+1]|ç0
 
    para|ç1 i|ç2 de|ç1 1|ç2 até|ç1 m|ç2{|ç0
        lookup|ç2[0][i]|ç0 = |ç00|ç2
    }
    para|ç1 j|ç2 de|ç1 1|ç2 até|ç1 n|ç2{
      lookup|ç2[i][0] = |ç01|ç2
    }
    para |ç1i|ç2 de|ç1 1|ç2 até|ç1 m|ç2 {|ç0
      para |ç1j |ç2de|ç1 1|ç2 até|ç1 n|ç2 {|ç0
            se|ç1 mainstring|ç2[i - 1] == [j - 1]{|ç0
                lookup|ç2[i][j] =  |ç0lookup|ç2[i - 1][j - 1] + |ç0
                                lookup|ç2[i - 1][j]|ç0
            }
            caso contrario |ç1{|ç0
                lookup|ç2[i][j] =|ç0 lookup|ç2[i - 1][j]|ç0
              }
      }
    }
  
    retorna|ç1 lookup|ç0[m][n]
    }
`;
let recursiveCorrectness = `
    pré condições: a e b são strings, m e n são inteiros positivos|ç3
    pós condições: retorna o número de vezes que b ocorre em a|ç3
    algoritmo |ç0contarOcorrencia|ç1(|ç0a|ç2,|ç0 b|ç2,|ç0 m|ç2,|ç0 n|ç2){|ç0
    se|ç1 n|ç2 ==|ç0 0|ç2 {|ç0
        retorne|ç1 1|ç2
    }
    se|ç1 m |ç2== |ç00|ç2 {|ç0
        retorne|ç1 0|ç2
    }
    se|ç1 a|ç2[|ç0m|ç2 -|ç0 1|ç2] == |ç0b|ç2[|ç0n|ç2 -|ç0 1|ç2] {|ç0
        retorne |ç1contarOcorrencia|ç0(|ç0a|ç2,|ç0 b|ç2,|ç0 m |ç2-|ç01|ç2,|ç0 n|ç2|ç2-|ç01|ç2) + contarOcorrencia(|ç0a|ç2,|ç0 b|ç2,|ç0 m |ç2-|ç01|ç2,|ç0 n|ç2)
    }|ç0 senão|ç1 {|ç0
        retorne|ç1 contarOcorrencia|ç0(|ç0a|ç2,|ç0 b|ç2,|ç0 m |ç2-|ç01|ç2,|ç0 n|ç2)
    }
}
`;
//# sourceMappingURL=stringToCodeBlock.js.map