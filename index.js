window.onload = function(){
    // 観測ボタン登録
    document.getElementById("observeButton").addEventListener("click", observe);

    // 順番を制御するための変数
    let turnCount = 0;
    const stoneArray = ["90%●", "10%○", "70%●", "30%○"];
    const blackChance = [0.9, 0.1, 0.7, 0.3];
    const stoneImgs = [
        "./imgs/black90.png",
        "./imgs/black10.png",
        "./imgs/black70.png",
        "./imgs/black30.png",
    ];
    const black = 0;
    const white = 1;
    const observedStones = ["./imgs/Black.png", "./imgs/White.png"];

    // 観測回数
    let observeCount = [5, 5];  // [黒, 白]

    const SIZE = 9;
    let board = Array.from({length: SIZE}, () => Array(SIZE).fill(-1));
    console.log(board);
    createBoard(SIZE, "quantumTable", true);  

    function createBoard(size, tableId, enableClickEvent = null){
        // table作成
        const table = document.getElementById(tableId);
        table.innerHTML = "";   // 既存の内容を削除
        for (let y = 0; y < size; y++) {
            const tr = document.createElement("tr");
            for (let x = 0; x < size; x++) {
                const td = document.createElement("td");
                td.id = `${tableId}-cell-${y}-${x}`;
                
                // クリックイベント追加
                if (enableClickEvent){
                    td.style.cursor = "pointer";
                    td.addEventListener("click", () => {
                        if (board[y][x] == -1) {
                            putGomoku(y, x, tableId);
                            turnCount++;
                        }
                    });
                }
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        // return table;
    }

    function putGomoku(y, x, tableId) {
        board[y][x] = turnCount % stoneArray.length;
        // console.log(board);

        // レンダリング
        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                const cell = document.getElementById(`quantumTable-cell-${y}-${x}`);
                cell.innerHTML = ""; // 既存の表示を消す

                const stoneId = board[y][x];
                if (stoneId !== null && stoneId >= 0 && stoneId < stoneArray.length) {
                    const img = document.createElement("img");
                    img.src = stoneImgs[stoneId];
                    img.width = 48;
                    img.height = 48;
                    cell.appendChild(img);
                }
            }
        }

        // 次の手表示
        const infoText = `次の手：${stoneArray[(turnCount+1) % stoneArray.length]}`;
        document.getElementById("infoArea").textContent = infoText;
    }

    function observe() {
        // alert("観測した！");
        // 残り回数更新
        let observer = (turnCount-1) % 2;   // 0->黒, 1->白
        if (observeCount[observer] <= 0) {
            alert("観測回数が残っていません！");
            return;
        }

        observeCount[observer]--;
        const leftText = `残り観測回数 （黒：${observeCount[0]}回 / 白：${observeCount[1]}回）`
        document.getElementById("observeLeft").innerHTML = `
            ${leftText}
            <button class="button" id="observeButton">観測</button>
        `;
        document.getElementById("observeButton").addEventListener("click", observe);

        // 観測処理
        let observedBoard = Array.from({length: SIZE}, () => Array(SIZE).fill(-1));
    console.log(board);

        for (let y = 0; y < SIZE; y++) {
            for (let x = 0; x < SIZE; x++) {
                if (board[y][x] != -1){
                    let chance = blackChance[board[y][x]];
                    let r = Math.random();
                    if  (r <= chance) {
                        observedBoard[y][x] = black;
                    } else {
                        observedBoard[y][x] = white;
                    }
                }
            }
        }
        // レンダリング
        createBoard(SIZE, "observeTable");
        for (let y = 0; y < observedBoard.length; y++) {
            for (let x = 0; x < observedBoard[y].length; x++) {
                const cell = document.getElementById(`observeTable-cell-${y}-${x}`);
                cell.innerHTML = ""; // 既存の表示を消す

                const stoneId = observedBoard[y][x];
                if (stoneId !== null && stoneId >= 0 && stoneId < observedStones.length) {
                    const img = document.createElement("img");
                    img.src = observedStones[stoneId];
                    img.width = 48;
                    img.height = 48;
                    cell.appendChild(img);
                }
            }
        }
    }
}