# Como documentar um componente na vitrine

Todo componente do Rapidocs DS tem **uma página só** — o *one page* — com as
mesmas quatro abas, na mesma ordem. O Alert é o molde: copie `Alert.mdx` +
`Alert.stories.ts` + `Alert.receita.ts` e troque o conteúdo.

> Estrutura inspirada nos design systems de referência (Material, Carbon e o DS
> do Itaú): documenta-se **por componente**, não por linguagem — uma página,
> abas internas, playground no topo.

## Na barra lateral: dois itens, sempre

```
Componentes / <Nome>
  ├── Docs          ← a página única (o .mdx)
  └── Playground    ← o exemplo com controles
```

As variações **não são itens de menu**: são stories com `tags: ['!dev']`,
invisíveis na navegação e usadas nos blocos `<Canvas>` da página. Nada de
"Galeria", "Large", "Small" ou "Código" soltos — isso vira lista repetida e
confunde quem procura o componente.

Nas stories (`<Comp>.stories.ts`):

- o `meta` **não** leva `tags: ['autodocs']` — a página Docs é o MDX anexado;
- só o `Playground` fica visível, com os controles ligados;
- o resto é catálogo: `tags: ['!dev']` e `controls: { disable: true }`;
- nome com acento via `name:` (`'Conteúdo opcional'`, `'Variações'`…);
- `role="alert"` e outras *live regions* **só** no exemplo interativo — vitrine
  estática com live region faz o leitor de tela anunciar a página inteira.

## As quatro abas

| Aba | O que vai dentro |
|---|---|
| **Visão geral** | Playground (`<Canvas>` + `<Controls>`), as variações e a tabela de tokens que o componente usa |
| **Regras de uso** | Quando usar · cartões *Faça / Evite* · como escolher entre as variações · orientação de texto |
| **Código** | Seletor **Angular / Flutter** + importar, usar e tratar eventos + tabela da API real |
| **Acessibilidade** | O que já vem resolvido no componente · o que depende de quem usa |

### O que NÃO entra na página do componente

**Instalação do design system.** Instalar o pacote, ligar os tokens e carregar a
fonte é assunto do DS inteiro e se faz **uma vez por projeto**: mora em
**Fundação → Instalação** (`stories/Instalacao.mdx`). A aba Código só aponta
para lá.

## Como as abas funcionam

CSS puro: `<input type="radio">` escondido + `<label>` + seletor `:checked ~`.
O estilo vem de `../vitrine/abas.ts`:

```mdx
import { ABAS_CSS } from '../vitrine/abas';

<style>{ABAS_CSS}</style>
```

Sem JavaScript porque o React não é dependência direta deste pacote
(`@storybook/html-vite`) — e o resultado é melhor: funciona no build estático do
GitHub Pages e o teclado navega nativamente pelo grupo de rádio.

O markup precisa respeitar esta ordem (o CSS usa o combinador `~`, que só olha
para frente):

```jsx
<div className="rds-abas">
  <input type="radio" name="abas-<comp>" id="aba-visao" defaultChecked />
  <input type="radio" name="abas-<comp>" id="aba-regras" />
  <input type="radio" name="abas-<comp>" id="aba-codigo" />
  <input type="radio" name="abas-<comp>" id="aba-a11y" />

  <nav className="rds-abas__barra" aria-label="...">
    <label htmlFor="aba-visao">Visão geral</label>
    …
  </nav>

  <div className="rds-abas__painel" data-aba="visao"> … </div>
  …
</div>
```

Os `id` são **fixos** (`aba-visao`, `aba-regras`, `aba-codigo`, `aba-a11y`,
`lang-angular`, `lang-flutter`) porque o CSS referencia cada um. O `name` muda
por componente, para dois documentos não brigarem.

Dentro de JSX, o MDX só processa markdown se houver **linha em branco** antes e
depois do conteúdo — mantenha o espaçamento do `Alert.mdx`.

Classes utilitárias: `.rds-regras` com `.rds-regra--faca` / `.rds-regra--evite`
(os cartões) e `.rds-nota` (observação em destaque).

## Regras que valem para qualquer componente

1. **Sem cor solta.** Todo valor visual sai de `var(--token)`. Faltando token,
   registre em `.claude/debt.md` em vez de chumbar hexadecimal.
2. **A tabela de API é transcrita do código**, não escrita de memória — abra o
   `.component.ts` e o `.dart` e confira propriedade por propriedade.
3. **Texto escapado.** Conteúdo vindo de controles passa por `esc()` antes de
   entrar em HTML: a vitrine tem que se comportar como o componente real, que
   escapa.
4. **Honestidade na prévia mobile.** O Storybook roda no navegador e não executa
   Flutter — onde houver moldura de celular, diga que é simulação com os mesmos
   tokens.
5. Os trechos de código ficam num `<Comp>.receita.ts` ao lado (crase e `${}`
   dentro de MDX quebram fácil) e **espelham os arquivos reais** do pacote.

## Antes de abrir PR

```bash
corepack pnpm --dir apps/storybook exec storybook build -o /tmp/sb-check --quiet
```

Gere o build **fora** do repositório e confira na vitrine servida: as abas
trocam, as tabelas renderizam como tabela, o botão de copiar do `<Source>`
funciona e nada fica ilegível no tema escuro.
