import test from "blue-tape";
import {Catavolt} from "../../catavolt/dialog/Catavolt";
import {Session} from "../../catavolt/models/Session";
import {Log, LogLevel} from "../../catavolt/util/Log";

Log.logLevel(LogLevel.DEBUG);

test("Login Test", (t) => {

    const [tenantId, userId, password] = ['', '', ''];

    return Catavolt.login(tenantId, 'DESKTOP', userId, password).then((session:Session)=>{

        t.ok(session, 'Expecting a non-null result');
        t.ok(session.id, 'Expecting a session id');
        t.comment(`> SessionId: ${session.id}`);
        return session;

    });

});
