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
const database_1 = __importDefault(require("./services/database"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const helmet_1 = __importDefault(require("helmet"));
const logger_1 = __importDefault(require("./utils/logger"));
const url_model_1 = __importDefault(require("./models/url.model"));
const valid_url_1 = __importDefault(require("valid-url"));
const http_1 = require("http");
const nanoid_1 = require("nanoid");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
const server = (0, http_1.createServer)(app);
dotenv_1.default.config();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: process.env.ORIGIN, optionsSuccessStatus: 200 }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get("/", (req, res) => {
    res.status(200).send("url shortener");
});
app.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info("shorten url");
    const { url } = req.body;
    if (!url)
        throw new http_errors_1.default.BadRequest("provide a valid url"); //if no url was recieved.
    try {
        if (!valid_url_1.default.isUri(url))
            throw new http_errors_1.default.BadRequest("invalid url"); //if url is not valid.
        let foundUrl = yield url_model_1.default.findOne({ longUrl: url });
        if (foundUrl) {
            return res.status(200).json({ url: foundUrl.shortUrl });
        }
        else {
            let urlCode = (0, nanoid_1.nanoid)(8);
            const urlData = new url_model_1.default({
                longUrl: url,
                shortUrl: `${process.env.BASE_URL}/${urlCode}`,
                urlCode,
            });
            // save link
            const resp = yield urlData.save();
            return res.status(200).json({ url: resp.shortUrl });
        }
    }
    catch (error) {
        logger_1.default.error(`Generating url: ${error}`);
        next(error);
    }
}));
app.get("/:code", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = yield url_model_1.default.findOne({ urlCode: req.params.code });
        if (!url)
            throw new http_errors_1.default.NotFound("url not avaliable");
        return res.redirect(url.longUrl);
    }
    catch (error) {
        logger_1.default.error(`Accessing url: ${error}`);
        next(error);
    }
}));
app.use("*", (req, res, next) => {
    next(new http_errors_1.default.NotFound("This route doen't exist"));
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    });
});
server.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, database_1.default)();
    logger_1.default.info("server started");
}));
