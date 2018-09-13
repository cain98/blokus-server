const roomController = require('../controllers/room.controller');

module.exports = function sockets(io) {
  io.on('connection', (socket) => {
    const socketId = socket.id;
    socket.emit('connected');

    socket.on('block_select', () => {});

    socket.on('block_move', (data) => {
      roomController.moveBlock(data.roomId, data.block, data.userId).then((res) => {
        socket.broadcast.emit('blockMove', {
          block: res,
        });
      });
    });

    socket.on('block_edit', (data) => {
      console.log('block edit')
      roomController.editBlock(data.roomId, data.block, data.userId).then((res) => {
        socket.broadcast.emit('blockEdit', {
          block: res,
        });
      });
    });
    socket.on('room_connect', ({ roomId, userId }) => {
      // status can be: joined, select, full
      roomController.join(roomId, userId).then(({ room, player, status }) => {
        io.to(`${socketId}`).emit('roomJoined', { room, player, status: 'select' });
      });
    });
    socket.on('player_connect', ({ roomId, userId }) => {
      roomController.playerSelect(roomId, userId).then(({ room, player }) => {
        socket.broadcast.emit('playerJoined', {
          room,
          player,
        });
        io.to(`${socketId}`).emit('roomJoined', { room, player, status: 'joined' });
        // io.to(`${socketId}`).emit('blockData', { blocks: room.blocks });
      });
    });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
