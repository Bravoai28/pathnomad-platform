/**
 * PATH NOMAD — Creative Nomads member system (localStorage)
 * Applications → Admin approval → Member portal access
 */
const PathNomadMembers = (function () {
    const KEYS = {
        applications: 'pathnomad_applications',
        members: 'pathnomad_members',
        session: 'pathnomad_session',
        adminSession: 'pathnomad_admin_session',
    };

    const ADMIN_PIN = 'pathnomad-admin-2026';

    function uid() {
        return 'pn_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    }

    function read(key) {
        try {
            return JSON.parse(localStorage.getItem(key) || '[]');
        } catch {
            return key === KEYS.session || key === KEYS.adminSession ? null : [];
        }
    }

    function readObj(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch {
            return null;
        }
    }

    function write(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function generateAccessCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
        return code;
    }

    function normalizeEmail(email) {
        return (email || '').trim().toLowerCase();
    }

    /* ── Applications ── */

    function getApplications() {
        return read(KEYS.applications);
    }

    function getApplication(id) {
        return getApplications().find(a => a.id === id);
    }

    function submitApplication(data) {
        const apps = getApplications();
        const email = normalizeEmail(data.email);
        const pending = apps.find(a => a.email === email && a.status === 'pending');
        if (pending) {
            return { ok: false, error: 'You already have a pending application. We will respond within 48 hours.' };
        }
        const approved = apps.find(a => a.email === email && a.status === 'approved');
        if (approved) {
            return { ok: false, error: 'This email is already an approved member. Sign in at the member portal.' };
        }

        const app = {
            id: uid(),
            name: data.name.trim(),
            email,
            discipline: data.discipline,
            portfolio: (data.portfolio || '').trim(),
            location: data.location.trim(),
            billing: data.billing || 'monthly',
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        apps.push(app);
        write(KEYS.applications, apps);
        return { ok: true, application: app };
    }

    /* ── Admin ── */

    function adminLogin(pin) {
        if (pin !== ADMIN_PIN) return { ok: false, error: 'Invalid admin credentials.' };
        write(KEYS.adminSession, { at: Date.now() });
        return { ok: true };
    }

    function adminLogout() {
        localStorage.removeItem(KEYS.adminSession);
    }

    function isAdminLoggedIn() {
        return !!readObj(KEYS.adminSession);
    }

    function approveApplication(id) {
        if (!isAdminLoggedIn()) return { ok: false, error: 'Admin not signed in.' };
        const apps = getApplications();
        const idx = apps.findIndex(a => a.id === id);
        if (idx === -1) return { ok: false, error: 'Application not found.' };
        const app = apps[idx];
        if (app.status === 'approved') return { ok: false, error: 'Already approved.' };

        const accessCode = generateAccessCode();
        app.status = 'approved';
        app.approvedAt = new Date().toISOString();
        app.accessCode = accessCode;
        apps[idx] = app;
        write(KEYS.applications, apps);

        const members = read(KEYS.members);
        const existing = members.findIndex(m => m.email === app.email);
        const member = {
            id: app.id,
            name: app.name,
            email: app.email,
            discipline: app.discipline,
            portfolio: app.portfolio,
            location: app.location,
            billing: app.billing,
            accessCode,
            approvedAt: app.approvedAt,
            memberSince: app.approvedAt,
        };
        if (existing >= 0) members[existing] = member;
        else members.push(member);
        write(KEYS.members, members);

        return { ok: true, application: app, accessCode };
    }

    function rejectApplication(id) {
        if (!isAdminLoggedIn()) return { ok: false, error: 'Admin not signed in.' };
        const apps = getApplications();
        const idx = apps.findIndex(a => a.id === id);
        if (idx === -1) return { ok: false, error: 'Application not found.' };
        apps[idx].status = 'rejected';
        apps[idx].rejectedAt = new Date().toISOString();
        write(KEYS.applications, apps);
        return { ok: true };
    }

    function revokeMember(email) {
        if (!isAdminLoggedIn()) return { ok: false, error: 'Admin not signed in.' };
        const e = normalizeEmail(email);
        let members = read(KEYS.members).filter(m => m.email !== e);
        write(KEYS.members, members);
        const apps = getApplications().map(a => {
            if (a.email === e && a.status === 'approved') {
                return { ...a, status: 'revoked', revokedAt: new Date().toISOString() };
            }
            return a;
        });
        write(KEYS.applications, apps);
        const session = readObj(KEYS.session);
        if (session && session.email === e) localStorage.removeItem(KEYS.session);
        return { ok: true };
    }

    /* ── Member portal ── */

    function getMembers() {
        return read(KEYS.members);
    }

    function getMemberByEmail(email) {
        return getMembers().find(m => m.email === normalizeEmail(email));
    }

    function memberLogin(email, accessCode) {
        const member = getMemberByEmail(email);
        if (!member) return { ok: false, error: 'No approved membership found for this email.' };
        if (member.accessCode.toUpperCase() !== accessCode.trim().toUpperCase()) {
            return { ok: false, error: 'Invalid access code. Check the code sent when you were approved.' };
        }
        const session = {
            memberId: member.id,
            email: member.email,
            name: member.name,
            at: Date.now(),
        };
        write(KEYS.session, session);
        return { ok: true, member };
    }

    function memberLogout() {
        localStorage.removeItem(KEYS.session);
    }

    function getSession() {
        const session = readObj(KEYS.session);
        if (!session) return null;
        const member = getMembers().find(m => m.id === session.memberId);
        if (!member) {
            localStorage.removeItem(KEYS.session);
            return null;
        }
        return { session, member };
    }

    function updateMemberProfile(updates) {
        const current = getSession();
        if (!current) return { ok: false, error: 'Not signed in.' };
        const members = getMembers();
        const idx = members.findIndex(m => m.id === current.member.id);
        if (idx === -1) return { ok: false, error: 'Member not found.' };
        members[idx] = {
            ...members[idx],
            portfolio: updates.portfolio !== undefined ? updates.portfolio : members[idx].portfolio,
            location: updates.location !== undefined ? updates.location : members[idx].location,
            bio: updates.bio !== undefined ? updates.bio : members[idx].bio,
        };
        write(KEYS.members, members);
        return { ok: true, member: members[idx] };
    }

    function seedDemoMember() {
        if (getMembers().length > 0) return;
        const demo = {
            id: 'pn_demo_member',
            name: 'Demo Creative',
            email: 'demo@pathnomad.co',
            discipline: 'Photography',
            portfolio: 'https://pathnomad.co',
            location: 'Johannesburg, South Africa',
            billing: 'monthly',
            accessCode: 'DEMO2026',
            approvedAt: new Date().toISOString(),
            memberSince: new Date().toISOString(),
        };
        write(KEYS.members, [demo]);
        write(KEYS.applications, [{
            ...demo,
            status: 'approved',
            createdAt: demo.approvedAt,
        }]);
    }

    return {
        KEYS,
        ADMIN_PIN,
        submitApplication,
        getApplications,
        getApplication,
        adminLogin,
        adminLogout,
        isAdminLoggedIn,
        approveApplication,
        rejectApplication,
        revokeMember,
        getMembers,
        getMemberByEmail,
        memberLogin,
        memberLogout,
        getSession,
        updateMemberProfile,
        seedDemoMember,
    };
})();

if (typeof window !== 'undefined') {
    window.PathNomadMembers = PathNomadMembers;
    PathNomadMembers.seedDemoMember();
}