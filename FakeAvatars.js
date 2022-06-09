var params = [
    {
        label: "Number of players",
        name: "count",
        type: "number",
        required: true,
        defaultValue: 20
    },
    {
        label: "Wss url",
        name: "wssUrl",
        type: "selection",
        required: true,
        options: [
            {key: "Local Host", value: "ws://localhost:8080"},
            {key: "Dev Server", value: "wss://utopiapi.vitaminhq.ir"},
            {key: "Server", value: "wss://api.utopia42.club"},
        ],
        defaultValue: "wss://utopiapi.vitaminhq.ir"
    },
];

console.log("Running FakeAvatars Script");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
    try {
        var Inputs = await rxjs.firstValueFrom(
            UtopiaApi.getInputsFromUser({
                inputs: params,
            })
        );
        var socketConfigs = [];
        let playerPos = await rxjs.firstValueFrom(UtopiaApi.getPlayerPosition());

        for (let i = 0; i < Inputs.count; i++) {
            var ws = new WebSocket(Inputs.wssUrl + "/position");
            let sc = {
                index: i,
                socket: ws,
                lastPos: playerPos,
                toPass: 0,
                lastMovement: null,
                lastCamera: null
            };
            ws.onopen = event => {
                console.log("Opened " + i);
                socketConfigs.push(sc);
            };
            ws.onerror = event => {
                console.log("Error From " + i);
                console.error(event);
            };
            ws.onclose = event => {
                console.log("Closed " + i);
                console.log(event);
                socketConfigs.splice(socketConfigs.indexOf(sc), 1);
            }
        }
        while (true) {
            socketConfigs.forEach(sc => {
                sendState(sc);
            });
            await sleep(100);
        }
    } catch (e) {
        console.log("Error catch: " + e);
    }
}


function sendState(sc) {
    if (sc.socket.readyState === 0)
        return;
    // {
    //     walletId: string;
    //     position: Position;
    //     forward: Position;
    //     sprint: boolean;
    //     floating: boolean;
    //     jump: boolean;
    // }

    let movement;
    let forward;
    if (sc.toPass !== 0) {
        sc.toPass = sc.toPass - 1;
        movement = sc.lastMovement;
        forward = sc.lastForward;
    } else {
        sc.toPass = getRandomPassTime();
        movement = getRandomMove();
        forward = {
            x: Math.random() - 0.5,
            y: 0.5,
            z: Math.random() - 0.5
        };
        sc.lastMovement = movement;
        sc.lastForward = forward;
    }
    let newPos = updatePos(sc.lastPos, movement);
    sc.lastPos = newPos;
    let newState = {
        walletId: "wallet_" + sc.index,
        position: newPos,
        forward: forward,
        sprint: false,
        floating: false,
        jump: false,
    };
    sc.socket.send(JSON.stringify(newState));
}

function getRandomPassTime() {
    return Math.floor(Math.random() * 10) + 10;
}

function getRandomMoveAmount() {
    return Math.random() * 2 - 1;
}

function getRandomMove() {
    let random = Math.random();
    if (random > 0.5) {
        return {
            x: getRandomMoveAmount(),
            y: 0,
            z: 0,
        };
    } else {
        return {
            x: 0,
            y: 0,
            z: getRandomMoveAmount(),
        };
    }
}

function updatePos(oldPos, movement) {
    return {
        x: oldPos.x + movement.x,
        y: oldPos.y + movement.y,
        z: oldPos.z + movement.z,
    };
}
