class Player {
    constructor(name, teamColor) {
        this.name = name;
        this.teamColor = teamColor;
        this.state = 'alive';
    }
    win() {

    }
    lose() {

    }
    die() {
        this.state = 'dead';
    }
    remove() {

    }
    changeTeam() {

    }
}

const playerFactory = function(name, teamColor) {
    const newPlayer = new Player(name, teamColor);
    playerDirector.receiveMessage('addPlayer', newPlayer); // 给中介者发送消息，新增玩家

    return newPlayer;
};

const playerDirector = (function() {
    const players = {},
        operations = {}; // 中介者可以执行的操作
    
    operations.addPlayer = function(player) {
        const teamColor = player.teamColor;
        players[teamColor] = players[teamColor] || []; // 如果改颜色玩家还没有成立队伍，则新建一个队伍
        players[teamColor].push(player); // 添加玩家进队伍
    };

    operations.removePlayer = function(player) {
        const teamColor = player.teamColor,
            teamPlayers = players[teamColor] || [];
        for (let i = teamPlayers.length - 1; i >= 0; i--) {
            if (teamPlayers[i] === player) {
                teamPlayers.splice(i, 1);
            }
        }
    };

    operations.changeTeam = function( player, newTeamColor ){ // 玩家换队
        operations.removePlayer( player ); // 从原队伍中删除
        player.teamColor = newTeamColor; // 改变队伍颜色
        operations.addPlayer( player ); // 增加到新队伍中
    }; 

    operations.playerDead = function(player) {
        const teamColor = player.teamColor,
            teamPlayers = players[teamColor]; // 玩家所在队伍
        let all_dead = true;
        
        for (let i = 0, player; player = teamPlayers[i++]; ) {
            if (player.state !== 'dead') {
                all_dead = false;
                break;
            }
        }
        if (all_dead === true) {
            for (let i, player; player = teamPlayers[i++]; ) {
                player.lose(); // 本队所有玩家lose
            }

            for (let color in players) {
                if (color !== teamColor) {
                    const teamPlayers = players[color]; // 其他队伍的玩家
                    for (let player of teamPlayers) {
                        player.win(); // 其他队伍所有玩家win
                    }
                }
            }
        }
    };

    const receiveMessage = function(...args) {
        const message = args.shift();
        operations[message](...args);
    };

    return {
        receiveMessage
    }
})();