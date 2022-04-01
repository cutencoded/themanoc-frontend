
import config from './../config/config';

const create = async (params, credentials, translation) => {
    try {
        let response = await fetch(`${config.serverUrl}/api/translations/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify(translation)
        });

        return await response.json();
    } catch (error) {
        console.log(error);
    }
};

const list = async (signal) => {
    try {
        let response = await fetch(`${config.serverUrl}/api/translations/`, { method: 'GET', signal });
        return await response.json();
    } catch (error) {
        console.log(error);
    }
};

const listByUser = async (params, credentials) => {
    try {
        const response = await fetch(`${config.serverUrl}/api/translations/by/` + params.userId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        });

        return await response.json();
    } catch (error) {
        console.log(error);
    }
};

const userTranslationCount = async (params, credentials) => {
    try {
        const response = await fetch(`${config.serverUrl}/api/translations/count/` + params.userId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        });

        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

const update = async (translation) => {
    try {
        let response = await fetch(`${config.serverUrl}/api/translations/`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(translation)
        });

        return await response.json();
    } catch (error) {
        console.log(error);
    }
};

const remove = async (params, credentials) => {
    try {
      let response = await fetch(`${config.serverUrl}/api/translations/` + params.translationId, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
};

const upvote = async (params, credentials, translationId) => {
    try {
      let response = await fetch(`${config.serverUrl}/api/translations/upvote/`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify({ userId: params.userId, translationId })
      });

      return await response.json();
    } catch(err) {
        console.log(err)
    }
};

const removeUpvote = async (params, credentials, translationId) => {
    try {
        let response = await fetch(`${config.serverUrl}/api/translations/rupvote/`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
        },
            body: JSON.stringify({ userId: params.userId, translationId })
        });

        return await response.json();
    } catch(err) {
        console.log(err);
    }
};

const downvote = async (params, credentials, translationId) => {
    try {
      let response = await fetch(`${config.serverUrl}/api/translations/downvote/`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify({ userId: params.userId, translationId })
      });

      return await response.json();
    } catch(err) {
        console.log(err)
    }
};

const removeDownvote = async (params, credentials, translationId) => {
    try {
        let response = await fetch(`${config.serverUrl}/api/translations/rdownvote/`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
        },
            body: JSON.stringify({ userId: params.userId, translationId })
        });

        return await response.json();
    } catch(err) {
        console.log(err);
    }
};

export {
    create,
    list,
    update,
    remove,
    listByUser,
    upvote,
    removeUpvote,
    downvote,
    removeDownvote,
    userTranslationCount
};
