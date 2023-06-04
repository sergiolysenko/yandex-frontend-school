class Article {
    constructor(node) {
        this.article = node;
        this.width = this.getWidth();
        this.height = this.getHeight();
        this.top = this.article.style.top;
        this.left = this.article.style.left;
    }

    setPosition(x, y) {
        this.article.style.position = 'absolute';
        this.setX(x);
        this.setY(y);
    };

    setWidth(width) {
        this.article.style.width = width + "px";
    }

    setX(x) {
        this.left = x + 'px';
        this.article.style.left = x + 'px';
    }

    setY(y) {
        this.top = y + 'px';
        this.article.style.top = y + 'px';
    }

    getXPosition() {
        return this.left;
    }

    getYPosition() {
        return this.top;
    }

    getWidth() {
        return this.article.getBoundingClientRect().width;
    }

    getHeight() {
        return this.article.getBoundingClientRect().height;
    }
}

const getXPosition = (articleIndex, itemWidth, gap) => {
    return (itemWidth + gap) * articleIndex;
}

const getXPrevPosition = (prevRow, articleIndex) => {
    const position = parseFloat(prevRow[articleIndex].getXPosition());

    return position;
}
const getYPosition = (articleIndex, prevRow, gap) => {
    const position = parseFloat(prevRow[articleIndex].getYPosition());
    const height = prevRow[articleIndex].getHeight();

    return position + height + gap;
}

function renderWaterfall(rootNode, columnCount, elementGap) {
    rootNode.setAttribute('style', `display: flex flex-wrap: wrap`);
    const articles = Array.from(document.querySelector(".root").children);
    const rootWidth = rootNode.getBoundingClientRect().width;
    const eachColumnWidth = (rootWidth / columnCount) - (elementGap * (columnCount - 1));

    const newArticles = articles.map((item) => {
        const article = new Article(item);
        article.setWidth(eachColumnWidth);
        return article;
    })

    let newArr = [];

    for (let i = 0; i < columnCount; i++) {
        newArr = [...newArr, newArticles.splice(0, columnCount)];
    }

    newArr.forEach((row, rowIndex) => {
        row.forEach((article, articleIndex) => {
            if (rowIndex === 0) {
                article.setPosition(getXPosition(articleIndex, article.getWidth(), elementGap), 0);
            } else {
                const prevSortedRow = newArr[rowIndex - 1].slice().sort((a, b) => {
                    if (a.getHeight() > b.getHeight()) {
                        return 1;
                    } else {
                        return -1;
                    }
                });

                article.setPosition(getXPrevPosition(prevSortedRow, articleIndex), getYPosition(articleIndex, prevSortedRow, elementGap));
            }
        });
    });
}

const rootNode = document.querySelector('.root');
const columnCount = 4;
const elementGap = 20;

renderWaterfall(rootNode, columnCount, elementGap);