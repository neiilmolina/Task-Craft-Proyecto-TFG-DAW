"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const FriendsRepository_1 = __importDefault(require("@/src/friends/model/FriendsRepository"));
const crypto_1 = require("crypto");
const schemasFriends_1 = require("task-craft-models/src/model/friends/interfaces/schemasFriends");
const constants_1 = require("@/src/core/constants");
const secretKey = process.env.JWT_SECRET;
class FriendsWebSocketController {
    constructor(socket, IFriendsDAO) {
        this.socket = socket;
        this.getFriendRequests = (filters) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Validación de filtros
                if (filters) {
                    const result = (0, schemasFriends_1.validateFriendFilters)(filters);
                    console.log("Resultado validación", result);
                    if (!result || !result.success) {
                        const errorMessages = (_a = result === null || result === void 0 ? void 0 : result.errors) === null || _a === void 0 ? void 0 : _a.map((error) => error.message).join(", ");
                        console.error("Errores de validación:", errorMessages);
                        this.socket.emit("friend_requests_error", {
                            message: `Filtro inválido: ${errorMessages}`,
                        });
                        return;
                    }
                }
                // Obtener solicitudes de amistad
                const friendRequests = yield this.friendsRepository.getAll(filters || {});
                console.log("Solicitudes de amistad:", friendRequests);
                // Si no hay solicitudes, lanzar un error
                if (!friendRequests || friendRequests.length === 0) {
                    throw new Error("No se encontraron solicitudes de amistad");
                }
                // Emitir las solicitudes de amistad
                this.socket.emit("friend_requests", friendRequests);
            }
            catch (error) {
                // Manejo de errores
                const errorMessage = error instanceof Error ? error.message : "Error desconocido";
                console.log("Error:", errorMessage);
                if (error instanceof Error && error.stack) {
                    console.error("Stack trace:", error.stack);
                }
                // Enviar el error al cliente
                this.socket.emit("friend_requests_error", {
                    message: errorMessage,
                });
            }
        });
        this.handleSendFriendRequest = (idSecondUser) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const firstUser = (_a = this.socket.data.user) === null || _a === void 0 ? void 0 : _a.idUser;
                if (!firstUser) {
                    throw new Error("El primer usuario no está disponible.");
                }
                const data = {
                    firstUser: firstUser,
                    secondUser: idSecondUser,
                    friendRequestState: false,
                };
                // Realizar la validación
                const result = (0, schemasFriends_1.validateFriendCreate)(data);
                console.log("Validation result:", result);
                if (!result.success) {
                    const errorMessages = (_b = result.errors) === null || _b === void 0 ? void 0 : _b.map((error) => error.message).join(", ");
                    throw new Error(errorMessages);
                }
                // Generar un id para la amistad
                const idFriend = (0, crypto_1.randomUUID)();
                // Verificar que el idFriend sea válido
                if (!constants_1.UUID_REGEX.test(idFriend)) {
                    throw new Error("El ID de la amistad debe ser válido");
                }
                // Intentar crear la amistad
                const friend = yield this.friendsRepository.create(idFriend, data);
                if (!friend) {
                    throw new Error("Error al crear la amistad");
                }
                // Emitir el resultado exitoso
                this.socket.emit("friend_request_sent", { success: true, friend });
            }
            catch (error) {
                this.socket.emit("error", {
                    message: "Error al enviar solicitud de amistad",
                    error,
                });
            }
        });
        this.handleAcceptFriendRequest = (friendId) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!constants_1.UUID_REGEX.test(friendId))
                    throw new Error("El ID de la amistad debe ser válido");
                const result = yield this.friendsRepository.update(friendId);
                if (!result)
                    throw new Error("Error al actualizar la amistad");
                this.socket.emit("friend_request_accepted", { success: true, result });
            }
            catch (error) {
                this.socket.emit("error", {
                    message: "Error al aceptar solicitud de amistad",
                    error,
                });
            }
        });
        this.handleDeleteFriendRequest = (friendId) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!constants_1.UUID_REGEX.test(friendId))
                    throw new Error("El ID de la amistad debe ser válido");
                const result = yield this.friendsRepository.delete(friendId);
                if (!result)
                    throw new Error("Error al eliminar la amistad");
                this.socket.emit("friend_request_deleted", { success: true, result });
            }
            catch (error) {
                this.socket.emit("error", {
                    message: "Error al eliminar solicitud de amistad",
                    error,
                });
            }
        });
        this.handleDisconnect = () => {
            console.log(`🔌 Usuario desconectado: ${this.socket.id}`);
        };
        this.friendsRepository = new FriendsRepository_1.default(IFriendsDAO);
        this.authenticateAndInit();
    }
    // Authenticate the user and initialize the events
    authenticateAndInit() {
        var _a, _b;
        const token = (_b = (_a = this.socket.handshake.headers.cookie) === null || _a === void 0 ? void 0 : _a.match(/access_token=([^;]+)/)) === null || _b === void 0 ? void 0 : _b[1];
        if (!token) {
            this.socket.emit("auth_error", "Token no proporcionado");
            this.socket.disconnect();
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secretKey);
            this.socket.data.user = decoded;
            // console.log(
            //   `✅ Usuario autenticado vía socket: ${this.socket.data.user.idUser}`
            // );
            this.registerEvents();
        }
        catch (error) {
            this.socket.emit("auth_error", "Token inválido o expirado");
            this.socket.disconnect();
        }
    }
    registerEvents() {
        this.socket.on("send_friend_request", this.handleSendFriendRequest);
        this.socket.on("accept_friend_request", this.handleAcceptFriendRequest);
        this.socket.on("disconnect", this.handleDisconnect);
        this.socket.on("delete_friend_request", this.handleDeleteFriendRequest);
        this.socket.on("get_friend_requests", this.getFriendRequests);
    }
}
exports.default = FriendsWebSocketController;
